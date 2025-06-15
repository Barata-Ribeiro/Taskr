package com.barataribeiro.taskr.user.dtos;

import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserAuthorDTO implements Serializable {
    private UUID id;
    private String username;
    private Roles role;
    private String displayName;
    private String avatarUrl;
    private Boolean isPrivate;
    private Boolean isVerified;
}