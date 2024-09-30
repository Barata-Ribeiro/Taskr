package com.barataribeiro.taskr.dtos.user;

import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link User}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ContextDTO implements Serializable {
    private String id;
    private String username;
    private String displayName;
    private String fullName;
    private String avatarUrl;
    private String email;
    private Roles role;
    private int managedProjects;
    private Long totalNotifications;
    private Long totalReadNotifications;
    private Long totalUnreadNotifications;
    private Instant createdAt;
    private Instant updatedAt;
}