package com.barataribeiro.taskr.dtos.auth;

import java.io.Serializable;

public record LoginRequestDTO(String username,
                              String password,
                              Boolean rememberMe) implements Serializable {
}
