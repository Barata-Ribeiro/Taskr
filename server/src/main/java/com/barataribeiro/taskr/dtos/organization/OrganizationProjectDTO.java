package com.barataribeiro.taskr.dtos.organization;

import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for {@link com.barataribeiro.taskr.models.relations.OrganizationProject}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrganizationProjectDTO {
    private ProjectDTO project;
    private String status;
}