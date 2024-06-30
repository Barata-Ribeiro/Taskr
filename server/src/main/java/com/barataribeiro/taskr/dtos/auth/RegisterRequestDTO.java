package com.barataribeiro.taskr.dtos.auth;

import java.io.Serializable;

public record RegisterRequestDTO(String username,
                                 String displayName,
                                 String email,
                                 String password) implements Serializable {
}
