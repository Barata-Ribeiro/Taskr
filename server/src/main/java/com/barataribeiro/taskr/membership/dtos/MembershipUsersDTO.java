package com.barataribeiro.taskr.membership.dtos;

import com.barataribeiro.taskr.project.enums.ProjectRole;
import com.barataribeiro.taskr.user.dtos.UserAuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.barataribeiro.taskr.membership.Membership}
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
