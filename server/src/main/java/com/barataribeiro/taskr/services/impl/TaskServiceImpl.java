package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.NotificationMapper;
import com.barataribeiro.taskr.builder.ProjectMapper;
import com.barataribeiro.taskr.builder.TaskMapper;
import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.task.CompleteTaskDTO;
import com.barataribeiro.taskr.dtos.task.TaskCreateRequestDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.dtos.task.TaskUpdateRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.ForbiddenRequestException;
import com.barataribeiro.taskr.exceptions.generics.IllegalRequestException;
import com.barataribeiro.taskr.models.embeddables.ProjectTaskId;
import com.barataribeiro.taskr.models.embeddables.TaskUserId;
import com.barataribeiro.taskr.models.entities.Notification;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.Task;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.enums.TaskStatus;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import com.barataribeiro.taskr.models.relations.TaskUser;
import com.barataribeiro.taskr.repositories.entities.NotificationRepository;
import com.barataribeiro.taskr.repositories.entities.ProjectRepository;
import com.barataribeiro.taskr.repositories.entities.TaskRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectTaskRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectUserRepository;
import com.barataribeiro.taskr.repositories.relations.TaskUserRepository;
import com.barataribeiro.taskr.services.NotificationService;
import com.barataribeiro.taskr.services.TaskService;
import com.barataribeiro.taskr.utils.AppConstants;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional
    public TaskDTO createTask(String projectId, @NotNull TaskCreateRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        Project project = projectRepository
                .findById(Long.valueOf(projectId))
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        if (!projectUserRepository.existsByProject_IdAndUser_Id(Long.valueOf(projectId), user.getId())) {
            throw new IllegalRequestException("User is not in the project.");
        }

        LocalDate parsedStartDate = body.startDate() == null ? LocalDate.now() : parseDate(body.startDate());
        LocalDate parsedDueDate = parseDate(body.dueDate());

        if (parsedDueDate.isBefore(LocalDate.now())) {
            throw new IllegalRequestException(AppConstants.CANNOT_BE_IN_THE_PAST);
        }

        if (parsedStartDate.isAfter(parsedDueDate)) {
            throw new IllegalRequestException(AppConstants.CANNOT_BE_AFTER_DUE_DATE);
        }

        TaskStatus status = body.status() == null ? TaskStatus.OPEN : TaskStatus.valueOf(body.status().toUpperCase());
        TaskPriority priority = body.priority() == null ? TaskPriority.LOW : TaskPriority.valueOf(
                body.priority().toUpperCase());

        Task newTask = taskRepository.save(Task.builder()
                                               .title(body.title())
                                               .description(body.description())
                                               .status(status)
                                               .priority(priority)
                                               .startDate(parsedStartDate)
                                               .dueDate(parsedDueDate)
                                               .build());

        ProjectTaskId projectTaskId = new ProjectTaskId(project.getId(), newTask.getId());
        projectTaskRepository.save(ProjectTask.builder()
                                              .id(projectTaskId)
                                              .project(project)
                                              .task(newTask)
                                              .build());

        TaskUserId taskUserId = new TaskUserId(newTask.getId(), user.getId());
        taskUserRepository.save(TaskUser.builder()
                                        .id(taskUserId)
                                        .task(newTask)
                                        .user(user)
                                        .isCreator(true)
                                        .build());

        project.incrementTasksCount();
        projectRepository.save(project);

        return taskMapper.toDTO(newTask);
    }

    @Override
    public Map<String, Object> getProjectTasks(String projectId, Principal principal) {
        Set<ProjectTask> projectTasks = projectTaskRepository.findAllByProject_id(Long.valueOf(projectId));
        Project project = projectTasks.stream()
                                      .findFirst()
                                      .map(ProjectTask::getProject)
                                      .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        Set<Task> tasks = projectTasks.stream()
                                      .map(ProjectTask::getTask)
                                      .collect(Collectors.toSet());

        Map<String, List<CompleteTaskDTO>> sortedTasks = sortTasksByPriority(tasks);

        Map<String, Object> returnData = new LinkedHashMap<>();
        returnData.put(AppConstants.PROJECT, projectMapper.toDTO(project));
        returnData.put("tasks", sortedTasks.isEmpty() ? Collections.emptyMap() : sortedTasks);

        return returnData;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getTaskInfo(String projectId, String taskId) {
        ProjectTask projectTask = projectTaskRepository
                .findByProject_IdAndTask_Id(Long.valueOf(projectId), Long.valueOf(taskId))
                .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

        Set<TaskUser> taskUsers = taskUserRepository
                .findTaskCreatorAndAssignedUsersByTaskId(projectTask.getTask().getId(), true, true);
        User taskCreator = taskUsers.stream()
                                    .filter(TaskUser::isCreator)
                                    .map(TaskUser::getUser)
                                    .findFirst()
                                    .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));
        Set<User> assignedUsers = taskUsers.stream()
                                           .filter(TaskUser::isAssigned)
                                           .map(TaskUser::getUser)
                                           .collect(Collectors.toSet());


        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        Map<String, Object> taskMap = objectMapper.convertValue(taskMapper.toDTO(projectTask.getTask()),
                                                                new TypeReference<>() {});
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

        Optional.ofNullable(body.title()).ifPresent(task::setTitle);
        Optional.ofNullable(body.description()).ifPresent(task::setDescription);

        Optional.ofNullable(body.status())
                .ifPresent(bodyStatus -> task.setStatus(TaskStatus.valueOf(bodyStatus.toUpperCase())));

        Optional.ofNullable(body.priority())
                .ifPresent(bodyPriority -> task.setPriority(TaskPriority.valueOf(bodyPriority.toUpperCase())));

        Optional.ofNullable(body.startDate()).ifPresent(date -> {
            LocalDate parsedDate = parseDate(date);

            if (parsedDate.isAfter(body.dueDate() == null ? task.getDueDate() : parseDate(body.dueDate()))) {
                throw new IllegalRequestException(AppConstants.CANNOT_BE_AFTER_DUE_DATE);
            }

            task.setStartDate(parsedDate);
        });

        Optional.ofNullable(body.dueDate()).ifPresent(date -> {
            LocalDate parsedDate = parseDate(date);

            if (parsedDate.isBefore(LocalDate.now())) {
                throw new IllegalRequestException(AppConstants.CANNOT_BE_IN_THE_PAST);
            }

            if (task.getStartDate().isAfter(parsedDate)) {
                throw new IllegalRequestException(AppConstants.CANNOT_BE_AFTER_DUE_DATE);
            }

            task.setDueDate(parsedDate);
        });

        sendNotificationToAssignedUser(task, principal);

        return taskMapper.toDTO(taskRepository.saveAndFlush(task));
    }

    @Override
    @Transactional
    public TaskDTO assignTask(String projectId, String taskId, String username, Principal principal) {
        if (taskUserRepository.existsByTask_IdAndUser_UsernameAndIsAssigned(Long.valueOf(taskId), username, true)) {
            throw new IllegalRequestException("User is already assigned to the task.");
        }

        Task task = getTaskIfRequestingUserIsManagerOrAdmin(projectId, taskId, principal);

        User userToAssign = userRepository.findByUsername(username)
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        if (!projectUserRepository.existsByProject_IdAndUser_Id(Long.valueOf(projectId), userToAssign.getId())) {
            throw new IllegalRequestException("User is not part of the project.");
        }

        TaskUser taskUser = taskUserRepository
                .findByTask_Id(Long.valueOf(taskId))
                .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

        if (userToAssign.getUsername().equals(principal.getName())) {
            taskUser.setAssigned(true);
            taskUserRepository.save(taskUser);
            return taskMapper.toDTO(task);
        }

        if (taskUser.isCreator() && !taskUser.isAssigned()) {
            taskUser.setAssigned(true);
            taskUserRepository.save(taskUser);
            sendNotificationToNowAssignedUser(principal, task, userToAssign);
            return taskMapper.toDTO(task);
        }

        TaskUserId taskUserId = new TaskUserId(task.getId(), userToAssign.getId());
        TaskUser newTaskUser = TaskUser.builder()
                                       .id(taskUserId)
                                       .task(task)
                                       .user(userToAssign)
                                       .isAssigned(true)
                                       .build();
        taskUserRepository.save(newTaskUser);

        sendNotificationToNowAssignedUser(principal, task, userToAssign);

        return taskMapper.toDTO(task);
    }

    @Override
    @Transactional
    public void deleteTask(String projectId, String taskId, Principal principal) {
        Task task = getTaskIfRequestingUserIsManagerOrAdmin(projectId, taskId, principal);

        projectTaskRepository.deleteByTask(task);
        taskUserRepository.deleteByTask(task);
        taskRepository.delete(task);
    }

    private void sendNotificationToNowAssignedUser(@NotNull Principal principal, @NotNull Task task,
                                                   User userToAssign) {
        Notification notification = Notification.builder()
                                                .title("Task Assigned")
                                                .message(String.format("You have been assigned to the task %s by %s.",
                                                                       task.getTitle(),
                                                                       principal.getName()))
                                                .user(userToAssign)
                                                .build();
        notificationRepository.save(notification);

        notificationService.sendNotificationThroughWebsocket(userToAssign.getUsername(),
                                                             notificationMapper.toDTO(notification));
    }

    private @NotNull Map<String, List<CompleteTaskDTO>> sortTasksByPriority(Set<Task> tasks) {
        Map<String, List<CompleteTaskDTO>> sortedTasks = new LinkedHashMap<>();
        sortedTasks.put("lowPriority", this.filterTasksByPriority(tasks, TaskPriority.LOW));
        sortedTasks.put("mediumPriority", this.filterTasksByPriority(tasks, TaskPriority.MEDIUM));
        sortedTasks.put("highPriority", this.filterTasksByPriority(tasks, TaskPriority.HIGH));
        return sortedTasks;
    }

    public List<CompleteTaskDTO> filterTasksByPriority(@NotNull Set<Task> tasks, TaskPriority priority) {
        return tasks.stream()
                    .filter(task -> task.getPriority().equals(priority))
                    .map(task -> {
                        TaskDTO taskDTO = taskMapper.toDTO(task);
                        Optional<UserDTO> userAssigned = task.getTaskUser().stream()
                                                             .filter(TaskUser::isAssigned)
                                                             .findFirst()
                                                             .map(taskUser -> userMapper.toDTO(taskUser.getUser()));

                        UserDTO userCreator = task.getTaskUser().stream()
                                                  .filter(TaskUser::isCreator)
                                                  .findFirst()
                                                  .map(taskUser -> userMapper.toDTO(taskUser.getUser()))
                                                  .orElseThrow(() -> new EntityNotFoundException(
                                                          User.class.getSimpleName()));

                        return CompleteTaskDTO.builder()
                                              .task(taskDTO)
                                              .userAssigned(userAssigned.orElse(null))
                                              .userCreator(userCreator)
                                              .build();
                    })
                    .toList();
    }

    private void sendNotificationToAssignedUser(@NotNull Task task, Principal principal) {
        taskUserRepository.findTaskCreatorAndAssignedUsersByTaskId(task.getId(), false, true)
                          .forEach(taskUser -> {
                              Notification notification = Notification.builder()
                                                                      .title("Task Modified")
                                                                      .message(String.format(
                                                                              "The task %s has been modified by %s. " +
                                                                                      "As an assigned user, you " +
                                                                                      "should check it out as soon as" +
                                                                                      " possible.",
                                                                              task.getTitle(),
                                                                              principal.getName()))
                                                                      .user(taskUser.getUser())
                                                                      .build();
                              notificationRepository.save(notification);

                              notificationService
                                      .sendNotificationThroughWebsocket(taskUser.getUser().getUsername(),
                                                                        notificationMapper.toDTO(notification));
                          });
    }

    private Task getTaskIfRequestingUserIsManagerOrAdmin(String projectId, String taskId,
                                                         @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        boolean isManager = projectUserRepository
                .existsProjectWhereUserByIdIsManager(Long.valueOf(projectId), user.getId(), true);

        boolean isOrgAdmin = organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true);

        if (!isManager && !isOrgAdmin) {
            throw new ForbiddenRequestException();
        }

        return taskRepository.findById(Long.valueOf(taskId))
                             .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));
    }

    private @NotNull LocalDate parseDate(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try {
            return LocalDate.parse(date, formatter);
        } catch (DateTimeParseException e) {
            log.atError().log("Error parsing date: {}", e.getMessage());
            throw new IllegalRequestException("Invalid date format. Use yyyy-MM-dd.");
        }
    }
}
