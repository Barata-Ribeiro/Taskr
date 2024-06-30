package com.barataribeiro.taskr.dtos.auth;

import java.io.Serializable;

public record RefreshTokenResponseDTO(String accessToken) implements Serializable {
}
