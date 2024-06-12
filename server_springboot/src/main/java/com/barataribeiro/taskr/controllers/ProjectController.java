package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/projects/{orgId}")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create-project")
    public ResponseEntity<RestResponseDTO> createProject(@PathVariable String orgId,
                                                         ProjectCreateRequestDTO body,
                                                         Principal principal) {

        ProjectDTO response = projectService.createProject(orgId, body, principal);

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Project created successfully",
                                                     null));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<RestResponseDTO> getProjectById(@PathVariable String orgId, @PathVariable String projectId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Project retrieved successfully",
                                                     null));
    }

    @GetMapping("/project/{projectId}/members")
    public ResponseEntity<RestResponseDTO> getProjectMembers(@PathVariable String orgId, @PathVariable String projectId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Project members retrieved successfully",
                                                     null));
    }

    @GetMapping("/project/{projectId}/tasks")
    public ResponseEntity<RestResponseDTO> getProjectTasks(@PathVariable String orgId, @PathVariable String projectId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Project tasks retrieved successfully",
                                                     null));
    }

    @PutMapping("/project/{projectId}")
    public ResponseEntity<RestResponseDTO> updateProject(@PathVariable String orgId, @PathVariable String projectId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Project updated successfully",
                                                     null));
    }

    @DeleteMapping("/project/{projectId}")
    public ResponseEntity<RestResponseDTO> deleteProject(@PathVariable String orgId, @PathVariable String projectId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Project deleted successfully",
                                                     null));
    }
}
