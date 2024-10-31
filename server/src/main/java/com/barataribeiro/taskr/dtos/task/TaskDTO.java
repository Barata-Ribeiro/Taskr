package com.barataribeiro.taskr.dtos.task;

import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.Task}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskDTO implements Serializable {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private String createdAt;
    private String updatedAt;
}