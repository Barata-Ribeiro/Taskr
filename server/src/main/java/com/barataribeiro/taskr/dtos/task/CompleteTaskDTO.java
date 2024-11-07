package com.barataribeiro.taskr.dtos.task;

import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompleteTaskDTO implements Serializable {
    TaskDTO task;
    UserDTO userAssigned;
    UserDTO userCreator;
}
