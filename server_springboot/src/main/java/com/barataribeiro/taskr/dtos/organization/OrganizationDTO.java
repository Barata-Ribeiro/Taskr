package com.barataribeiro.taskr.dtos.organization;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.Organization}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrganizationDTO implements Serializable {
    private Integer id;
    private String name;
    private String description;
    private Long membersCount;
    private Long projectsCount;
    private String logoUrl;
    private String websiteUrl;
    private String location;
    private String createdAt;
    private String updatedAt;
}