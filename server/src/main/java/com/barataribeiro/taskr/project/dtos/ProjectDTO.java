package com.barataribeiro.taskr.project.dtos;

import com.barataribeiro.taskr.project.enums.ProjectStatus;
import com.barataribeiro.taskr.user.dtos.UserAuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.barataribeiro.taskr.project.Project}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectDTO implements Serializable {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private ProjectStatus status;
    private UserAuthorDTO owner;
    private Instant createdAt;
    private Instant updatedAt;
}