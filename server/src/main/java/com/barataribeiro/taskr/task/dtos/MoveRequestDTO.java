package com.barataribeiro.taskr.task.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MoveRequestDTO implements Serializable {
    private Long projectId;
    private String newStatus;
    private Integer newPosition;
}