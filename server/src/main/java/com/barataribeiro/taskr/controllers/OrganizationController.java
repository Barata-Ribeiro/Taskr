package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.organization.ManagementRequestDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationRequestDTO;
import com.barataribeiro.taskr.dtos.organization.UpdateOrganizationRequestDTO;
import com.barataribeiro.taskr.services.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class OrganizationController {
    private final OrganizationService organizationService;

    @GetMapping("/")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getAllOrganizations(@RequestParam(defaultValue = "0")
                                                                                    int page,
                                                                                    @RequestParam(defaultValue = "10")
                                                                                    int perPage) {
        Map<String, Object> response = organizationService.getAllOrganizations(page, perPage);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organizations retrieved successfully",
                                                       response));
    }

    @GetMapping("/get-latest")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getTopThreeOrganizations() {
        Map<String, Object> response = organizationService.getTopThreeOrganizations();
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Latest organizations retrieved successfully",
                                                       response));
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO<OrganizationDTO>> getOrganizationInfo(@PathVariable String orgId) {
        OrganizationDTO response = organizationService.getOrganizationInfo(orgId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization info retrieved successfully",
                                                       response));
    }

    @GetMapping("/{orgId}/members")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getOrganizationMembers(@PathVariable String orgId) {
        Map<String, Object> response = organizationService.getOrganizationMembers(orgId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization members retrieved successfully",
                                                       response));
    }

    @GetMapping("/{orgId}/projects")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getOrganizationProjects(@PathVariable String orgId) {
        Map<String, Object> response = organizationService.getOrganizationProjects(orgId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization projects retrieved successfully",
                                                       response));
    }

    @PostMapping("/")
    public ResponseEntity<RestResponseDTO<OrganizationDTO>> createOrganization(@RequestBody OrganizationRequestDTO body,
                                                                               Principal principal) {
        OrganizationDTO response = organizationService.createOrganization(body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Organization created successfully",
                                                       response));
    }

    @PatchMapping("/{orgId}/management")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> addMemberToOrganization(@PathVariable String orgId,
                                                                                        @RequestBody
                                                                                        ManagementRequestDTO body,
                                                                                        Principal principal) {
        Map<String, Object> response = organizationService.manageOrganizationMembers(orgId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization members managed successfully",
                                                       response));
    }

    @PatchMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> updateOrganizationInfo(@PathVariable String orgId,
                                                                                       @RequestBody
                                                                                       UpdateOrganizationRequestDTO body,
                                                                                       Principal principal) {
        Map<String, Object> response = organizationService.updateOrganizationInfo(orgId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization info updated successfully",
                                                       response));
    }

    @DeleteMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO<?>> deleteOrganization(@PathVariable String orgId,
                                                                 Principal principal) {
        organizationService.deleteOrganization(orgId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                       HttpStatus.NO_CONTENT.value(),
                                                       "Organization deleted successfully",
                                                       null));
    }
}
