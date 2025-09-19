package com.barataribeiro.taskr.features.task.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReorderRequestDTO implements Serializable {
    private String status;
    private List<Long> taskIds;
}
