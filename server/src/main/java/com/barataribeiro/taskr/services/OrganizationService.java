package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.organization.ManagementRequestDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationRequestDTO;
import com.barataribeiro.taskr.dtos.organization.UpdateOrganizationRequestDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.Map;

public interface OrganizationService {
    OrganizationDTO createOrganization(OrganizationRequestDTO body, Principal principal);

    Page<OrganizationDTO> getAllOrganizations(String search, int page, int perPage, String direction, String orderBy,
                                              Principal principal);

    Map<String, Object> getTopThreeOrganizations();

    OrganizationDTO getOrganizationInfo(String id);

    Map<String, Object> getOrganizationMembers(String orgId, String search, int page, int perPage, String direction,
                                               String id);

    Map<String, Object> getOrganizationProjects(String id, String search, int page, int perPage, String direction,
                                                String orderBy);

    Map<String, Object> manageOrganizationMembers(String orgId, ManagementRequestDTO body, Principal principal);

    Map<String, Object> updateOrganizationInfo(String id, UpdateOrganizationRequestDTO body, Principal principal);

    void deleteOrganization(String id, Principal principal);

}
