package com.barataribeiro.taskr.dtos.auth;

import com.barataribeiro.taskr.dtos.user.UserDTO;

import java.io.Serializable;

public record RegisterResponseDTO(UserDTO user) implements Serializable {
}
