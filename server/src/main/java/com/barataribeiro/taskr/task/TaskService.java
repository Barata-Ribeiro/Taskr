package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.activity.events.task.TaskCreatedEvent;
import com.barataribeiro.taskr.activity.events.task.TaskUpdatedEvent;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.membership.Membership;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.notification.events.NewTaskNotificationEvent;
import com.barataribeiro.taskr.notification.events.TaskMembershipNotificationEvent;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.ProjectRepository;
import com.barataribeiro.taskr.project.enums.ProjectRole;
import com.barataribeiro.taskr.project.enums.ProjectStatus;
import com.barataribeiro.taskr.task.dtos.*;
import com.barataribeiro.taskr.task.enums.TaskPriority;
import com.barataribeiro.taskr.task.enums.TaskStatus;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.util.Streamable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class TaskService {
    private final MembershipRepository membershipRepository;
    private final TaskRepository taskRepository;
    private final TaskBuilder taskBuilder;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    private final @Lazy TaskService self = this;


    @Transactional(readOnly = true)
    public TasksByStatusDTO getTasksByProject(Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        TasksByStatusDTO tasksByStatus = new TasksByStatusDTO(new ArrayList<>(), new ArrayList<>(), new ArrayList<>());

        Streamable<Task> tasks = taskRepository.findAllByProject_Id(projectId);

        tasks.stream().parallel()
             .sorted(Comparator.comparingInt(Task::getPosition))
             .forEachOrdered(task -> {
                 TaskDTO taskDTO = taskBuilder.toTaskDTO(task);

                 switch (task.getStatus()) {
                     case TO_DO -> tasksByStatus.getToDo().add(taskDTO);
                     case IN_PROGRESS -> tasksByStatus.getInProgress().add(taskDTO);
                     case DONE -> tasksByStatus.getDone().add(taskDTO);
                 }
             });

        return tasksByStatus;
    }

    @Transactional(readOnly = true)
    public Set<TaskDTO> getLatestTasksByProject(Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Streamable<Task> tasks = taskRepository.findTop5ByProject_IdOrderByCreatedAtDesc(projectId);

        return new LinkedHashSet<>(tasks.stream().parallel().map(taskBuilder::toTaskDTO).toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long taskId, Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Task.class.getSimpleName());
        }

        Task task = taskRepository
                .findByIdAndProject_Id(taskId, projectId)
                .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

        return taskBuilder.toTaskDTO(task);
    }

    @Transactional
    public TaskDTO createTask(@Valid @NotNull TaskRequestDTO body, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), body.getProjectId())) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Project project = projectRepository
                .findById(body.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        if (project.getStatus() == ProjectStatus.COMPLETED || project.getStatus() == ProjectStatus.CANCELLED) {
            throw new IllegalRequestException("Cannot create task in a completed or cancelled project.");
        }

        if (LocalDateTime.parse(body.getDueDate()).isBefore(LocalDateTime.now())) {
            throw new IllegalRequestException("Due date cannot be in the past.");
        }

        User user = userRepository.findByUsername(authentication.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        TaskStatus status = TaskStatus.valueOf(body.getStatus());
        long nextPosition = taskRepository
                .countByProject_IdAndStatus(project.getId(), status) + 1;

        Task newTask = Task.builder()
                           .title(body.getTitle())
                           .description(body.getDescription())
                           .dueDate(LocalDateTime.parse(body.getDueDate()))
                           .status(status)
                           .priority(TaskPriority.valueOf(body.getPriority()))
                           .position((int) nextPosition)
                           .project(project)
                           .assignees(Set.of(user))
                           .build();

        Streamable<Membership> memberships = membershipRepository.findByProject_Id((project.getId()));

        eventPublisher.publishEvent(new TaskCreatedEvent(this, project, newTask, authentication.getName()));
        memberships.stream().parallel()
                   .filter(membership -> !membership.getUser().getUsername().equals(authentication.getName()))
                   .forEach(membership -> eventPublisher
                           .publishEvent(new NewTaskNotificationEvent(this, project.getId(), project.getTitle(),
                                                                      membership.getUser().getUsername(),
                                                                      newTask.getTitle())));

        return taskBuilder.toTaskDTO(taskRepository.saveAndFlush(newTask));
    }

    @Transactional
    public TaskDTO updateTask(Long taskId, @NotNull TaskUpdateRequestDTO body, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), body.getProjectId())) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Task task = taskRepository.findByIdAndProject_Id(taskId, body.getProjectId())
                                  .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

        Set<User> assignees = task.getAssignees();

        Project project = task.getProject();

        if (project.getStatus() == ProjectStatus.COMPLETED || project.getStatus() == ProjectStatus.CANCELLED) {
            throw new IllegalRequestException("Cannot update task in a completed or cancelled project.");
        }

        List<String> updates = new ArrayList<>();

        Optional.ofNullable(body.getTitle()).ifPresent(title -> {
            task.setTitle(title);
            updates.add(String.format("has updated the task title to '%s'.", title));
        });
        Optional.ofNullable(body.getDescription()).ifPresent(desc -> {
            task.setDescription(desc);
            updates.add("has updated the task description.");
        });
        Optional.ofNullable(body.getDueDate()).ifPresent(dueDate -> {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime dateTime = LocalDateTime.parse(dueDate, formatter);

            if (dateTime.isBefore(LocalDateTime.now())) {
                throw new IllegalRequestException("Due date cannot be in the past.");
            }

            if (dateTime.isEqual(task.getDueDate())) {
                throw new IllegalRequestException("Due date must be different from the current one.");
            }

            task.setDueDate(dateTime);
            updates.add(String.format("has updated the task due date to '%s'.", dateTime.format(formatter)));
        });
        Optional.ofNullable(body.getStatus()).ifPresent(status -> {
            TaskStatus newStatus = TaskStatus.valueOf(status);
            if (newStatus == TaskStatus.DONE && task.getStatus() != TaskStatus.IN_PROGRESS) {
                throw new IllegalRequestException("Task can only be marked as DONE if it is in progress.");
            }

            task.setStatus(newStatus);
            updates.add(String.format("has updated the task status to '%s'.", status));
        });
        Optional.ofNullable(body.getPriority()).ifPresent(priority -> {
            TaskPriority newPriority = TaskPriority.valueOf(priority);
            task.setPriority(newPriority);
            updates.add(
                    String.format("has updated the task priority to '%s'.", priority));
        });
        Optional.ofNullable(body.getMembersToAssign()).ifPresent(members -> members.parallelStream().forEach(member -> {
            if (!membershipRepository.existsByUser_UsernameAndProject_Tasks_Id(member, task.getId())) {
                throw new EntityNotFoundException(User.class.getSimpleName());
            }

            if (assignees.parallelStream().anyMatch(user -> user.getUsername().equals(member)) ||
                    assignees.parallelStream().anyMatch(user -> user.getUsername().equals(authentication.getName()))) {
                return;
            }

            User user = userRepository.findByUsername(member)
                                      .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

            assignees.add(user);
            updates.add(String.format("has assigned '%s' to the task.", member));
            String message = String.format("'%s' has assigned you to the task '%s'.",
                                           authentication.getName(), task.getTitle());
            eventPublisher.publishEvent(new TaskMembershipNotificationEvent(this, user, task.getTitle(),
                                                                            message, task.getTitle()));
        }));
        Optional.ofNullable(body.getMembersToUnassign())
                .ifPresent(members -> members.parallelStream().forEach(member -> {
                    if (!membershipRepository.existsByUser_UsernameAndProject_Tasks_Id(member, task.getId())) {
                        throw new EntityNotFoundException(User.class.getSimpleName());
                    }

                    User user = userRepository
                            .findByUsername(member)
                            .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

                    if (assignees.parallelStream().noneMatch(u -> u.getUsername().equals(user.getUsername()))) {
                        throw new IllegalRequestException(String.format("User '%s' is not assigned to this task.",
                                                                        user.getUsername()));
                    }

                    if (assignees.size() == 1 && assignees.parallelStream().anyMatch(u -> u.getUsername()
                                                                                           .equals(authentication.getName()))) {
                        throw new IllegalRequestException("Cannot unassign the only remaining assignee.");
                    }

                    assignees.removeIf(u -> u.getUsername().equals(user.getUsername()));
                    updates.add(String.format("has unassigned '%s' from the task.", member));
                    String message = String.format("'%s' has unassigned you from the task '%s'.",
                                                   authentication.getName(), task.getTitle());
                    eventPublisher.publishEvent(new TaskMembershipNotificationEvent(this, user, task.getTitle(),
                                                                                    message, task.getTitle()));
                }));

        task.setAssignees(assignees);

        updates.parallelStream()
               .forEachOrdered(update -> eventPublisher
                       .publishEvent(new TaskUpdatedEvent(this, task.getTitle(), project, authentication.getName(),
                                                          update)));
        assignees.parallelStream()
                 .filter(user -> !user.getUsername().equals(authentication.getName()))
                 .forEach(user -> eventPublisher
                         .publishEvent(new TaskUpdatedEvent(this, task.getTitle(), project, user.getUsername(),
                                                            updates.toString())));

        return taskBuilder.toTaskDTO(taskRepository.saveAndFlush(task));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public TasksByStatusDTO updateTaskOrder(Long projectId, ReorderRequestDTO body,
                                            @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        TaskStatus status = TaskStatus.valueOf(body.getStatus());
        List<Long> taskIdsInOrder = body.getTaskIds();

        List<Task> tasks = taskRepository.findAllByProject_IdAndStatusOrderByPositionAsc(projectId, status);

        Set<Long> tasksSet = tasks.parallelStream().map(Task::getId).collect(Collectors.toSet());

        if (!tasksSet.containsAll(taskIdsInOrder) || taskIdsInOrder.size() != tasksSet.size()) {
            throw new IllegalRequestException("Invalid task IDs for the status.");
        }

        if (taskIdsInOrder.size() != tasks.size()) {
            throw new IllegalRequestException("Task IDs count does not match the number of tasks in the status.");
        }

        for (int i = 0; i < taskIdsInOrder.size(); i++) {
            Long taskId = taskIdsInOrder.get(i);
            Task task = tasks.parallelStream()
                             .reduce((t1, t2) -> t1.getId().equals(taskId) ? t1 : t2)
                             .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

            task.setPosition(i + 1);
        }

        taskRepository.saveAllAndFlush(tasks);

        return self.getTasksByProject(projectId, authentication);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public TasksByStatusDTO moveTask(Long taskId, @NotNull MoveRequestDTO body,
                                     @NotNull Authentication authentication) {
        Long projectId = body.getProjectId();
        TaskStatus newStatus = TaskStatus.valueOf(body.getNewStatus());
        int newPosition = body.getNewPosition();

        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Task task = taskRepository.findById(taskId)
                                  .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

        if (!task.getProject().getId().equals(projectId)) {
            throw new IllegalRequestException("Task does not belong to the project.");
        }

        TaskStatus oldStatus = task.getStatus();
        List<Task> tasksToSave = new ArrayList<>();

        if (oldStatus == newStatus) {
            List<Task> tasksInStatus = taskRepository
                    .findAllByProject_IdAndStatusOrderByPositionAsc(projectId, newStatus);

            int currentIndex = -1;
            for (int i = 0; i < tasksInStatus.size(); i++) {
                if (tasksInStatus.get(i).getId().equals(taskId)) {
                    currentIndex = i;
                    break;
                }
            }

            if (currentIndex == -1) throw new IllegalStateException("Task not found in status.");

            Task movedTask = tasksInStatus.remove(currentIndex);

            int insertIndex = newPosition - 1;
            if (insertIndex < 0 || insertIndex > tasksInStatus.size()) {
                throw new IllegalRequestException("Invalid position.");
            }

            tasksInStatus.add(insertIndex, movedTask);
            for (int i = 0; i < tasksInStatus.size(); i++) {
                Task t = tasksInStatus.get(i);
                t.setPosition(i + 1);
                tasksToSave.add(t);
            }
        } else {
            List<Task> tasksInOldStatus = taskRepository
                    .findAllByProject_IdAndStatusOrderByPositionAsc(projectId, oldStatus);

            tasksInOldStatus.removeIf(t -> t.getId().equals(taskId));
            for (int i = 0; i < tasksInOldStatus.size(); i++) {
                Task t = tasksInOldStatus.get(i);
                t.setPosition(i + 1);
                tasksToSave.add(t);
            }

            List<Task> tasksInNewStatus = taskRepository
                    .findAllByProject_IdAndStatusOrderByPositionAsc(projectId, newStatus);

            if (newPosition < 1 || newPosition > tasksInNewStatus.size() + 1) {
                throw new IllegalRequestException("Invalid position.");
            }

            tasksInNewStatus.add(newPosition - 1, task);
            task.setStatus(newStatus);

            for (int i = 0; i < tasksInNewStatus.size(); i++) {
                Task t = tasksInNewStatus.get(i);
                t.setPosition(i + 1);
                tasksToSave.add(t);
            }
        }

        taskRepository.saveAll(tasksToSave);

        return self.getTasksByProject(projectId, authentication);
    }

    @Transactional
    public void deleteTask(Long taskId, Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository
                .existsByUser_UsernameAndProject_IdAndRoleIs(authentication.getName(), projectId, ProjectRole.OWNER)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        taskRepository.deleteById(taskId);
    }
}
