package com.barataribeiro.taskr.dtos.auth;

import com.barataribeiro.taskr.dtos.user.ContextDTO;
import jakarta.annotation.Nullable;

import java.io.Serializable;
import java.time.Instant;

public record LoginResponseDTO(ContextDTO user,
                               String accessToken,
                               Instant accessTokenExpiresAt,
                               @Nullable String refreshToken,
                               @Nullable Instant refreshTokenExpiresAt) implements Serializable {
}
