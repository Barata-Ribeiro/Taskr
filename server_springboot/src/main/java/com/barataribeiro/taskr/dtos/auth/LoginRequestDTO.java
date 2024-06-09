package com.barataribeiro.taskr.dtos.auth;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record LoginRequestDTO(@NotNull @NotEmpty(message = "Username cannot be empty.") String username,
                              @NotNull @NotEmpty(message = "Password cannot be empty.") String password,
                              Boolean rememberMe) implements Serializable {
}
