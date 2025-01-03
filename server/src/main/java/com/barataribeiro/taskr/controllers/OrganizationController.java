package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.organization.ManagementRequestDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationRequestDTO;
import com.barataribeiro.taskr.dtos.organization.UpdateOrganizationRequestDTO;
import com.barataribeiro.taskr.services.OrganizationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Tag(name = "Organizations", description = "Operations pertaining to organizations")
public class OrganizationController {
    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<RestResponseDTO<OrganizationDTO>> createOrganization(@RequestBody OrganizationRequestDTO body,
                                                                               Principal principal) {
        OrganizationDTO response = organizationService.createOrganization(body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Organization created successfully",
                                                       response));
    }

    @GetMapping
    public ResponseEntity<RestResponseDTO<Page<OrganizationDTO>>> getAllOrganizations(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Principal principal) {
        Page<OrganizationDTO> response = organizationService
                .getAllOrganizations(search, page, perPage, direction, orderBy, principal);
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
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getOrganizationMembers(
            @PathVariable String orgId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy) {
        Map<String, Object> response = organizationService
                .getOrganizationMembers(orgId, search, page, perPage, direction, orderBy);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization members retrieved successfully",
                                                       response));
    }

    @GetMapping("/{orgId}/projects")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getOrganizationProjects(
            @PathVariable String orgId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy) {
        Map<String, Object> response = organizationService
                .getOrganizationProjects(orgId, search, page, perPage, direction, orderBy);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization projects retrieved successfully",
                                                       response));
    }

    @PatchMapping("/{orgId}/management")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> manageOrganizationMembers(
            @PathVariable String orgId,
            @RequestBody ManagementRequestDTO body,
            Principal principal) {
        Map<String, Object> response = organizationService.manageOrganizationMembers(orgId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization members managed successfully",
                                                       response));
    }

    @PatchMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> updateOrganizationInfo(
            @PathVariable String orgId,
            @RequestBody UpdateOrganizationRequestDTO body,
            Principal principal) {
        Map<String, Object> response = organizationService.updateOrganizationInfo(orgId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Organization info updated successfully",
                                                       response));
    }

    @DeleteMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO<Void>> deleteOrganization(@PathVariable String orgId,
                                                                    Principal principal) {
        organizationService.deleteOrganization(orgId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                       HttpStatus.NO_CONTENT.value(),
                                                       "Organization deleted successfully",
                                                       null));
    }
}
