package com.barataribeiro.taskr.features.project.dtos;

import com.barataribeiro.taskr.features.membership.dtos.MembershipUsersDTO;
import com.barataribeiro.taskr.features.project.Project;
import com.barataribeiro.taskr.features.project.enums.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for {@link Project}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectCompleteDTO implements Serializable {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private ProjectStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    private Set<MembershipUsersDTO> memberships;
    private Long totalTasks;
}
