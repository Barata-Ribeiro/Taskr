package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.activity.dtos.ActivityDTO;
import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.project.dtos.ProjectCompleteDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import com.barataribeiro.taskr.project.dtos.ProjectUpdateRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Projects", description = "Endpoints for managing projects")
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping("/my")
    @Operation(summary = "Get all projects for the authenticated user",
               description = "Retrieves a list of projects associated with the authenticated user.")
    public ResponseEntity<RestResponse<Page<ProjectDTO>>> getMyProjects(
            @ModelAttribute PageQueryParamsDTO pageQueryParams,
            Authentication authentication) {
        Page<ProjectDTO> projects = projectService.getMyProjects(pageQueryParams, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Projects retrieved successfully", projects));
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Get project by ID",
               description = "Retrieves a project by its unique identifier.")
    public ResponseEntity<RestResponse<ProjectCompleteDTO>> getProjectById(@PathVariable Long projectId,
                                                                           Authentication authentication) {
        ProjectCompleteDTO project = projectService.getProjectById(projectId, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Project retrieved successfully", project));
    }

    @GetMapping("/{projectId}/activities")
    @Operation(summary = "Get activities for a project",
               description = "Retrieves all activities associated with a specific project.")
    public ResponseEntity<RestResponse<Page<ActivityDTO>>> getProjectActivities(
            @PathVariable Long projectId,
            @ModelAttribute PageQueryParamsDTO pageQueryParams,
            Authentication authentication) {
        Page<ActivityDTO> activities = projectService.getProjectActivities(projectId, pageQueryParams, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Activities retrieved successfully", activities));
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new project", description = "Creates a new project with the provided details.")
    public ResponseEntity<RestResponse<ProjectDTO>> createProject(@RequestBody @Valid ProjectRequestDTO body,
                                                                  Authentication authentication) {
        ProjectDTO project = projectService.createProject(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new RestResponse<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                      "Project created successfully", project));
    }

    @PatchMapping("/{projectId}")
    @Operation(summary = "Update an existing project",
               description = "Updates the details of an existing project identified by its ID.")
    public ResponseEntity<RestResponse<ProjectCompleteDTO>> updateProject(
            @PathVariable Long projectId,
            @RequestBody @Valid ProjectUpdateRequestDTO body, Authentication authentication) {
        ProjectCompleteDTO updatedProject = projectService.updateProject(projectId, body, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Project updated successfully", updatedProject));
    }

    @DeleteMapping("/{projectId}")
    @Operation(summary = "Delete a project",
               description = "Deletes a project identified by its ID.")
    public ResponseEntity<RestResponse<Void>> deleteProject(@PathVariable Long projectId,
                                                            Authentication authentication) {
        projectService.deleteProject(projectId, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                      "Project deleted successfully", null));
    }
}
