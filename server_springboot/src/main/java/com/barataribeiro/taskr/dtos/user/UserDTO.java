package com.barataribeiro.taskr.dtos.user;

import com.barataribeiro.taskr.models.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.User}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record UserDTO(String id,
                      String username,
                      String displayName,
                      String email,
                      Roles role,
                      Instant createdAt,
                      Instant updatedAt) implements Serializable {
}