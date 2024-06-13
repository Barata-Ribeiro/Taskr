package com.barataribeiro.taskr.dtos.task;

import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.Task}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record TaskDTO(Integer id, String title, String description, TaskStatus status, TaskPriority priority,
                      Instant createdAt, Instant updatedAt) implements Serializable {
}