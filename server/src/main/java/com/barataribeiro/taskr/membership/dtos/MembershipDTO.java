package com.barataribeiro.taskr.membership.dtos;

import com.barataribeiro.taskr.project.ProjectRole;
import com.barataribeiro.taskr.project.dtos.ProjectSimpleDTO;
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
public class MembershipDTO implements Serializable {
    private Long id;
    private ProjectSimpleDTO project;
    private ProjectRole role;
    private LocalDateTime joinedAt;
}