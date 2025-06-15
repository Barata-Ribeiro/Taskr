package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.activity.events.task.TaskCreatedEvent;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.ProjectRepository;
import com.barataribeiro.taskr.project.enums.ProjectStatus;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.task.dtos.TaskRequestDTO;
import com.barataribeiro.taskr.task.enums.TaskPriority;
import com.barataribeiro.taskr.task.enums.TaskStatus;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        if (!membershipRepository.existsByProject_IdAndUser_Username(projectId, authentication.getName())) {
            throw new EntityNotFoundException("Task not found or you do not have access to it.");
        }

        Task task = taskRepository
                .findByIdAndProject_Id(taskId, projectId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found or you do not have access to it."));

        return taskBuilder.toTaskDTO(task);
    }

    @Transactional
    public TaskDTO createTask(@Valid @NotNull TaskRequestDTO body, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByProject_IdAndUser_Username(body.getProjectId(), authentication.getName())) {
            throw new EntityNotFoundException("Project not found or you do not have access to it.");
        }

        Project project = projectRepository.findById(body.getProjectId())
                                           .orElseThrow(() -> new EntityNotFoundException("Project not found."));

        if (project.getStatus() == ProjectStatus.COMPLETED || project.getStatus() == ProjectStatus.CANCELLED) {
            throw new IllegalRequestException("Cannot create task in a completed or cancelled project.");
        }

        if (LocalDateTime.parse(body.getDueDate()).isBefore(LocalDateTime.now())) {
            throw new IllegalRequestException("Due date cannot be in the past.");
        }

        User user = userRepository.findByUsername(authentication.getName())
                                  .orElseThrow(() -> new EntityNotFoundException("User not found."));

        Task newTask = Task.builder()
                           .title(body.getTitle())
                           .description(body.getDescription())
                           .dueDate(LocalDateTime.parse(body.getDueDate()))
                           .status(TaskStatus.valueOf(body.getStatus()))
                           .priority(TaskPriority.valueOf(body.getPriority()))
                           .project(project)
                           .assignees(Set.of(user))
                           .build();

        eventPublisher.publishEvent(new TaskCreatedEvent(project, newTask, authentication.getName()));

        return taskBuilder.toTaskDTO(taskRepository.saveAndFlush(newTask));
    }
}
