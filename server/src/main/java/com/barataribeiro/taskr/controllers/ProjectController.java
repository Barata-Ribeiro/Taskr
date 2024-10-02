package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.dtos.project.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.services.ProjectService;
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
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/project-create")
    public ResponseEntity<RestResponseDTO<ProjectDTO>> createProject(@PathVariable String orgId,
                                                                     @RequestBody ProjectCreateRequestDTO body,
                                                                     Principal principal) {
        ProjectDTO response = projectService.createProject(orgId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project created successfully",
                                                       response));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getProjectInfo(@PathVariable String orgId,
                                                                               @PathVariable String projectId) {
        Map<String, Object> response = projectService.getProjectInfo(orgId, projectId);
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
                                                                                @PathVariable String projectId) {
        Map<String, Object> response = projectService.getProjectTasks(orgId, projectId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project tasks retrieved successfully",
                                                       response));
    }

    @PutMapping("/project/{projectId}")
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

    @PutMapping("/project/{projectId}/status")
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
    public ResponseEntity<RestResponseDTO<?>> deleteProject(@PathVariable String orgId, @PathVariable String projectId,
                                                            Principal principal) {
        projectService.deleteProject(orgId, projectId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project deleted successfully",
                                                       null));
    }
}
