package com.barataribeiro.taskr.dtos.organization;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.Organization}
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrganizationDTO implements Serializable {
    Integer id;
    String name;
    String description;
    Instant createdAt;
    Instant updatedAt;
}