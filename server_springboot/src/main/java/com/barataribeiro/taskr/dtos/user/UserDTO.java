package com.barataribeiro.taskr.dtos.user;

import com.barataribeiro.taskr.models.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.User}
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO implements Serializable {
    private String id;
    private String username;
    private String displayName;
    private String email;
    private Roles role;
    private Instant createdAt;
    private Instant updatedAt;
}