package com.barataribeiro.taskr.task.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.TreeSet;

/**
 * DTO for {@link com.barataribeiro.taskr.task.Task}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TasksByStatusDTO {
    private TreeSet<TaskDTO> toDo;
    private TreeSet<TaskDTO> inProgress;
    private TreeSet<TaskDTO> done;
}
