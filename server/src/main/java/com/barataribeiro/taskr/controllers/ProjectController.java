package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.dtos.project.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.services.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects/{orgId}")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Tag(name = "Project", description = "Operations related to projects")
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/project-create")
    public ResponseEntity<RestResponseDTO<ProjectDTO>> createProject(@PathVariable String orgId,
                                                                     @RequestBody ProjectCreateRequestDTO body,
                                                                     Principal principal) {
        ProjectDTO response = projectService.createProject(orgId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Project created successfully",
                                                       response));
    }

    @GetMapping("/me")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getProjectsWhereUserIsMember(@PathVariable String orgId,
                                                                                             Principal principal) {
        Map<String, Object> response = projectService.getProjectsWhereUserIsMember(orgId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Projects retrieved successfully",
                                                       response));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getProjectInfo(@PathVariable String orgId,
                                                                               @PathVariable String projectId,
                                                                               Principal principal) {
        Map<String, Object> response = projectService.getProjectInfo(orgId, projectId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project retrieved successfully",
                                                       response));
    }

    @GetMapping("/project/{projectId}/members")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getProjectMembers(@PathVariable String orgId,
                                                                                  @PathVariable String projectId) {
        Map<String, Object> response = projectService.getProjectMembers(orgId, projectId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project members retrieved successfully",
                                                       response));
    }

    @GetMapping("/project/{projectId}/tasks")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getProjectTasks(@PathVariable String orgId,
                                                                                @PathVariable String projectId,
                                                                                Principal principal) {
        Map<String, Object> response = projectService.getProjectTasks(orgId, projectId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project tasks retrieved successfully",
                                                       response));
    }

    @PatchMapping("/project/{projectId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> updateProject(@PathVariable String orgId,
                                                                              @PathVariable String projectId,
                                                                              @RequestBody ProjectUpdateRequestDTO body,
                                                                              Principal principal) {
        Map<String, Object> response = projectService.updateProject(orgId, projectId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project updated successfully",
                                                       response));
    }

    @PatchMapping("/project/{projectId}/status")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> changeProjectStatus(@PathVariable String orgId,
                                                                                    @PathVariable String projectId,
                                                                                    @RequestParam String status,
                                                                                    Principal principal) {
        Map<String, Object> response = projectService.changeProjectStatus(orgId, projectId, status, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project status updated successfully",
                                                       response));
    }

    @DeleteMapping("/project/{projectId}")
    public ResponseEntity<RestResponseDTO<Void>> deleteProject(@PathVariable String orgId,
                                                               @PathVariable String projectId,
                                                               Principal principal) {
        projectService.deleteProject(orgId, projectId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                       HttpStatus.NO_CONTENT.value(),
                                                       "Project deleted successfully",
                                                       null));
    }
}
