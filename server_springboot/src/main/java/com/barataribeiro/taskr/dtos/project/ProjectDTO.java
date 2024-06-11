package com.barataribeiro.taskr.dtos.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.Project}
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectDTO implements Serializable {
    Integer id;
    String name;
    String description;
    Long membersCount;
    Long tasksCount;
    Instant createdAt;
    Instant updatedAt;
}