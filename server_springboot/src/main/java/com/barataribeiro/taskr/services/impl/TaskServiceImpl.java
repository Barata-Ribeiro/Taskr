package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.ProjectMapper;
import com.barataribeiro.taskr.builder.TaskMapper;
import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.task.TaskCreateRequestDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.dtos.task.TaskUpdateRequestDTO;
import com.barataribeiro.taskr.exceptions.generics.BadRequest;
import com.barataribeiro.taskr.exceptions.generics.ForbiddenRequest;
import com.barataribeiro.taskr.exceptions.project.ProjectNotFound;
import com.barataribeiro.taskr.exceptions.task.AlreadyDueDate;
import com.barataribeiro.taskr.exceptions.task.StartDateAfterDueDate;
import com.barataribeiro.taskr.exceptions.task.TaskNotFound;
import com.barataribeiro.taskr.exceptions.task.WrongDueDateFormat;
import com.barataribeiro.taskr.exceptions.user.UserIsNotInProject;
import com.barataribeiro.taskr.exceptions.user.UserNotFound;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.Task;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.enums.TaskStatus;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import com.barataribeiro.taskr.models.relations.TaskUser;
import com.barataribeiro.taskr.repositories.entities.ProjectRepository;
import com.barataribeiro.taskr.repositories.entities.TaskRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectTaskRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectUserRepository;
import com.barataribeiro.taskr.repositories.relations.TaskUserRepository;
import com.barataribeiro.taskr.services.TaskService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TaskServiceImpl implements TaskService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final OrganizationUserRepository organizationUserRepository;
    private final ProjectUserRepository projectUserRepository;
    private final ProjectTaskRepository projectTaskRepository;
    private final TaskUserRepository taskUserRepository;
    private final UserMapper userMapper;
    private final ProjectMapper projectMapper;
    private final TaskMapper taskMapper;
    Logger logger = LoggerFactory.getLogger(TaskServiceImpl.class);

    @Override
    @Transactional
    public TaskDTO createTask(String projectId, @NotNull TaskCreateRequestDTO body,
                              @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);
        Project project = projectRepository.findById(Long.valueOf(projectId)).orElseThrow(ProjectNotFound::new);

        if (!projectUserRepository.existsByProject_IdAndUser_Id(Long.valueOf(projectId), user.getId())) {
            throw new UserIsNotInProject();
        }

        Date parsedStartDate = body.startDate() == null ? new Date() : parseDate(body.startDate());
        Date parsedDueDate = parseDate(body.dueDate());

        if (parsedDueDate.before(new Date())) {
            throw new AlreadyDueDate();
        }

        if (parsedStartDate.after(parsedDueDate)) {
            throw new BadRequest();
        }

        TaskStatus status = body.status() == null ? TaskStatus.OPEN : TaskStatus.valueOf(body.status().toUpperCase());
        TaskPriority priority = body.priority() == null ? TaskPriority.LOW : TaskPriority.valueOf(body.priority().toUpperCase());

        Task newTask = taskRepository.save(Task.builder()
                                                   .title(body.title())
                                                   .description(body.description())
                                                   .status(status)
                                                   .priority(priority)
                                                   .startDate(parsedStartDate)
                                                   .dueDate(parsedDueDate)
                                                   .build());

        projectTaskRepository.save(ProjectTask.builder()
                                           .project(project)
                                           .task(newTask)
                                           .build());

        taskUserRepository.save(TaskUser.builder()
                                        .task(newTask)
                                        .user(user)
                                        .isCreator(true)
                                        .build());

        project.incrementTasksCount();
        projectRepository.save(project);

        return taskMapper.toDTO(newTask);
    }

    @Override
    @Transactional
    public Map<String, Object> getTaskInfo(String projectId, String taskId) {
        ProjectTask projectTask = projectTaskRepository.findByProject_IdAndTask_Id(Long.valueOf(projectId),
                                                                                   Long.valueOf(taskId))
                .orElseThrow(TaskNotFound::new);

        Set<TaskUser> taskUsers = taskUserRepository.findTaskCreatorAndAssignedUsersByTaskId(projectTask.getTask().getId(),
                                                                                             true,
                                                                                             true);
        User taskCreator = taskUsers.stream()
                .filter(TaskUser::isCreator)
                .map(TaskUser::getUser)
                .findFirst()
                .orElseThrow(TaskNotFound::new);
        Set<User> assignedUsers = taskUsers.stream()
                .filter(TaskUser::isAssigned)
                .map(TaskUser::getUser)
                .collect(Collectors.toSet());


        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> taskMap = objectMapper.convertValue(taskMapper.toDTO(projectTask.getTask()), new TypeReference<>() {});
        taskMap.put("creator", userMapper.toDTO(taskCreator));
        taskMap.put("assigned", userMapper.toDTOList(new ArrayList<>(assignedUsers)));

        Map<String, Object> response = new HashMap<>();
        response.put("project", projectMapper.toDTO(projectTask.getProject()));
        response.put("task", taskMap);

        return response;
    }

    @Override
    @Transactional
    public TaskDTO updateTask(String projectId, String taskId,
                              @NotNull TaskUpdateRequestDTO body, Principal principal) {
        Task task = getTaskIfRequestingUserIsManagerOrAdmin(projectId, taskId, principal);

        Date parsedDueDate = body.dueDate() == null ? task.getDueDate() : parseDate(body.dueDate());
        Date parsedStartDate = body.startDate() == null ? task.getStartDate() : parseDate(body.startDate());

        if (parsedDueDate.before(new Date())) throw new AlreadyDueDate();
        if (parsedStartDate.after(parsedDueDate)) throw new StartDateAfterDueDate();

        TaskStatus status = body.status() == null ? task.getStatus()
                                                  : TaskStatus.valueOf(body.status().toUpperCase());
        TaskPriority priority = body.priority() == null ? task.getPriority()
                                                        : TaskPriority.valueOf(body.priority().toUpperCase());

        task.setTitle(body.title());
        task.setDescription(body.description());
        task.setStatus(status);
        task.setPriority(priority);
        task.setStartDate(parsedStartDate);
        task.setDueDate(parsedDueDate);

        return taskMapper.toDTO(taskRepository.save(task));
    }

    @Override
    @Transactional
    public void deleteTask(String projectId, String taskId, Principal principal) {
        Task task = getTaskIfRequestingUserIsManagerOrAdmin(projectId, taskId, principal);

        projectTaskRepository.deleteByTask(task);
        taskUserRepository.deleteByTask(task);
        taskRepository.delete(task);
    }

    private Task getTaskIfRequestingUserIsManagerOrAdmin(String projectId, String taskId, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);
        Task task = taskRepository.findById(Long.valueOf(taskId)).orElseThrow(TaskNotFound::new);
        boolean isManager = projectUserRepository.existsProjectWhereUserByIdIsManager(Long.valueOf(projectId),
                                                                                      user.getId(),
                                                                                      true);
        boolean isOrgAdmin = organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(),
                                                                                               true);

        if (!isManager && !isOrgAdmin) {
            throw new ForbiddenRequest();
        }

        return task;
    }

    private Date parseDate(String date) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        try {
            return formatter.parse(date);
        } catch (ParseException e) {
            logger.error("Invalid date format - {}", e.getMessage());
            throw new WrongDueDateFormat();
        }
    }
}
