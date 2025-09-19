package com.barataribeiro.taskr.features.project.dtos;

import com.barataribeiro.taskr.features.project.Project;
import com.barataribeiro.taskr.features.project.enums.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for {@link Project}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectSimpleDTO implements Serializable {
    private Long id;
    private String title;
    private ProjectStatus status;
}