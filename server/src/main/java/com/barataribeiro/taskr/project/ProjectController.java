package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.project.dtos.ProjectCompleteDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
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

    @PostMapping("/create")
    @Operation(summary = "Create a new project", description = "Creates a new project with the provided details.")
    public ResponseEntity<RestResponse<ProjectDTO>> createProject(@RequestBody @Valid ProjectRequestDTO body,
                                                                  Authentication authentication) {
        ProjectDTO project = projectService.createProject(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new RestResponse<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                      "Project created successfully", project));
    }
}
