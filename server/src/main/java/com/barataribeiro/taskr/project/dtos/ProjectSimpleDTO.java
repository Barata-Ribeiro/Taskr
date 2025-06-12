package com.barataribeiro.taskr.project.dtos;

import com.barataribeiro.taskr.project.ProjectStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for {@link com.barataribeiro.taskr.project.Project}
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