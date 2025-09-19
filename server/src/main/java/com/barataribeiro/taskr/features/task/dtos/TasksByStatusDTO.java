package com.barataribeiro.taskr.features.task.dtos;

import com.barataribeiro.taskr.features.task.Task;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link Task}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TasksByStatusDTO implements Serializable {
    private List<TaskDTO> toDo;
    private List<TaskDTO> inProgress;
    private List<TaskDTO> done;
}
