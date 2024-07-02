package com.barataribeiro.taskr.dtos.auth;

import com.barataribeiro.taskr.dtos.user.UserDTO;

import java.io.Serializable;
import java.time.Instant;

public record LoginResponseDTO(UserDTO user,
                               String token,
                               Instant tokenExpiresAt) implements Serializable {
}
