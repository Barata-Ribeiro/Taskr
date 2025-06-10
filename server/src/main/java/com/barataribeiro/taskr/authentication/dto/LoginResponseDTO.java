package com.barataribeiro.taskr.authentication.dto;

import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginResponseDTO implements Serializable {
    private UserSecurityDTO user;

    private String accessToken;

    private Instant accessTokenExpiresAt;

    @Nullable
    private String refreshToken;

    @Nullable
    private Instant refreshTokenExpiresAt;
}