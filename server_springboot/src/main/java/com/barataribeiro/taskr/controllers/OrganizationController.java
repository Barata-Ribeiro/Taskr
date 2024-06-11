package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/organizations")
public class OrganizationController {

    @GetMapping("/")
    public ResponseEntity<RestResponseDTO> getAllOrganizations(@RequestParam(defaultValue = "0") int page,
                                                               @RequestParam(defaultValue = "10") int perPage) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Organizations retrieved successfully",
                                                     null));
    }

    @GetMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO> getOrganizationInfo(@PathVariable String orgId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Organization info retrieved successfully",
                                                     null));
    }

    @GetMapping("/{orgId}/members")
    public ResponseEntity<RestResponseDTO> getOrganizationMembers(@PathVariable String orgId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Organization members retrieved successfully",
                                                     null));
    }

    @GetMapping("/{orgId}/projects")
    public ResponseEntity<RestResponseDTO> getOrganizationProjects(@PathVariable String orgId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Organization projects retrieved successfully",
                                                     null));
    }

    @PostMapping("/")
    public ResponseEntity<RestResponseDTO> createOrganization(@RequestBody Object body) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Organization created successfully",
                                                     null));
    }

    @PutMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO> updateOrganizationInfo(@PathVariable String orgId,
                                                                  @RequestBody Object body) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Organization info updated successfully",
                                                     null));
    }

    @DeleteMapping("/{orgId}")
    public ResponseEntity<RestResponseDTO> deleteOrganization(@PathVariable String orgId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Organization deleted successfully",
                                                     null));
    }
}
