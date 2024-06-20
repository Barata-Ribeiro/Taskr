package com.barataribeiro.taskr.dtos.project;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.Project}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectDTO implements Serializable {
    private Long id;
    private String name;
    private String description;
    private Long membersCount;
    private Long tasksCount;
    private String createdAt;
    private String updatedAt;
}