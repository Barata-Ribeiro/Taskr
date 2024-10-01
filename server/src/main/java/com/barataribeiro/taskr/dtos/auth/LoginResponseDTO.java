package com.barataribeiro.taskr.dtos.auth;

import com.barataribeiro.taskr.dtos.user.UserDTO;
import jakarta.annotation.Nullable;

import java.io.Serializable;
import java.time.Instant;

public record LoginResponseDTO(UserDTO user,
                               String accessToken,
                               @Nullable String refreshToken,
                               @Nullable Instant refreshTokenExpiresAt) implements Serializable {
}
