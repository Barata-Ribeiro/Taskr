package com.barataribeiro.taskr.user.dtos;

import com.barataribeiro.taskr.user.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * DTO for {@link com.barataribeiro.taskr.user.User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserSecurityDTO implements Serializable {
    private UUID id;
    private String username;
    private String email;
    private Roles role;
    private String avatarUrl;
    private Boolean isPrivate;
    private Boolean isVerified;
    private Instant createdAt;
    private Instant updatedAt;
}