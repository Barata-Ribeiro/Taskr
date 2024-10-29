package com.barataribeiro.taskr.dtos.organization;

import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for {@link com.barataribeiro.taskr.models.relations.OrganizationUser}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrganizationMemberDTO {
    private UserDTO user;
    private List<String> roles;
}
