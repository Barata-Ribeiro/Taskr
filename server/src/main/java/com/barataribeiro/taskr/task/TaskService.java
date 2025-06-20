package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.activity.events.task.TaskCreatedEvent;
import com.barataribeiro.taskr.activity.events.task.TaskUpdatedEvent;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.membership.Membership;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.notification.events.NewTaskNotificationEvent;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.ProjectRepository;
import com.barataribeiro.taskr.project.enums.ProjectStatus;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.task.dtos.TaskRequestDTO;
import com.barataribeiro.taskr.task.dtos.TaskUpdateRequestDTO;
import com.barataribeiro.taskr.task.enums.TaskPriority;
import com.barataribeiro.taskr.task.enums.TaskStatus;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.util.Streamable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class TaskService {
    private final MembershipRepository membershipRepository;
    private final TaskRepository taskRepository;
    private final TaskBuilder taskBuilder;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

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

        Task newTask = Task.builder()
                           .title(body.getTitle())
                           .description(body.getDescription())
                           .dueDate(LocalDateTime.parse(body.getDueDate()))
                           .status(TaskStatus.valueOf(body.getStatus()))
                           .priority(TaskPriority.valueOf(body.getPriority()))
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
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
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
}
