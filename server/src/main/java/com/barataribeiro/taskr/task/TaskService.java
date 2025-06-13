package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class TaskService {
    private final MembershipRepository membershipRepository;
    private final TaskRepository taskRepository;
    private final TaskBuilder taskBuilder;

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
}
