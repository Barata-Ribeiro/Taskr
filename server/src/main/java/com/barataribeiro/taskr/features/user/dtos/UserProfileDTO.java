package com.barataribeiro.taskr.features.user.dtos;

import com.barataribeiro.taskr.features.user.User;
import com.barataribeiro.taskr.features.user.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * DTO for {@link User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserProfileDTO implements Serializable {
    private UUID id;
    private String username;
    private String email;
    private Roles role;
    private String bio;
    private String displayName;
    private String fullName;
    private String avatarUrl;
    private String coverUrl;
    private String pronouns;
    private String location;
    private String website;
    private String company;
    private String jobTitle;
    private Boolean isPrivate;
    private Boolean isVerified;
    private Instant createdAt;
    private Instant updatedAt;

    private Long totalProjectsParticipated;
    private Long totalCreatedProjects;
    private Long totalAssignedTasks;
    private Long totalCommentsMade;
}
