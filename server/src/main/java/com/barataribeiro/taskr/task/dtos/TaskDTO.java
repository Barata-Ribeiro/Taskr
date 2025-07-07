package com.barataribeiro.taskr.task.dtos;

import com.barataribeiro.taskr.task.enums.TaskPriority;
import com.barataribeiro.taskr.task.enums.TaskStatus;
import com.barataribeiro.taskr.user.dtos.UserAuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link com.barataribeiro.taskr.task.Task}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskDTO implements Serializable {
    private Long id;
    private String title;
    private String description;
    private String dueDate;
    private TaskStatus status;
    private TaskPriority priority;
    private Integer position;
    private Instant createdAt;
    private Instant updatedAt;
    private Set<UserAuthorDTO> assignees;
}