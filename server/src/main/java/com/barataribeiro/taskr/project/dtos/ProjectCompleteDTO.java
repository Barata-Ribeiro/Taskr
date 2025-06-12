package com.barataribeiro.taskr.project.dtos;

import com.barataribeiro.taskr.membership.dtos.MembershipUsersDTO;
import com.barataribeiro.taskr.project.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for {@link com.barataribeiro.taskr.project.Project}
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
