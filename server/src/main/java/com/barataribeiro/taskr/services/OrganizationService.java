package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.organization.ManagementRequestDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationRequestDTO;
import com.barataribeiro.taskr.dtos.organization.UpdateOrganizationRequestDTO;

import java.security.Principal;
import java.util.Map;

public interface OrganizationService {
    OrganizationDTO createOrganization(OrganizationRequestDTO body, Principal principal);

    Map<String, Object> getAllOrganizations(int page, int perPage);

    Map<String, Object> getTopThreeOrganizations();

    OrganizationDTO getOrganizationInfo(String id);

    Map<String, Object> getOrganizationMembers(String id);

    Map<String, Object> getOrganizationProjects(String id);

    Map<String, Object> manageOrganizationMembers(String orgId, ManagementRequestDTO body, Principal principal);

    Map<String, Object> updateOrganizationInfo(String id, UpdateOrganizationRequestDTO body, Principal principal);

    void deleteOrganization(String id, Principal principal);

}
