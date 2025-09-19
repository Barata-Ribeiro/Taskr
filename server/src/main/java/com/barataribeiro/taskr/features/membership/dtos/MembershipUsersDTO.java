package com.barataribeiro.taskr.features.membership.dtos;

import com.barataribeiro.taskr.features.membership.Membership;
import com.barataribeiro.taskr.features.project.enums.ProjectRole;
import com.barataribeiro.taskr.features.user.dtos.UserAuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link Membership}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class MembershipUsersDTO implements Serializable {
    private Long id;
    private UserAuthorDTO user;
    private ProjectRole role;
    private LocalDateTime joinedAt;
}
