package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Projects", description = "Endpoints for managing projects")
public class ProjectController {
    private final ProjectService projectService;

    @RequestMapping("/create")
    @Operation(summary = "Create a new project", description = "Creates a new project with the provided details.")
    public ResponseEntity<RestResponse<ProjectDTO>> createProject(@RequestBody @Valid ProjectRequestDTO body,
                                                                  Authentication authentication) {
        ProjectDTO project = projectService.createProject(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new RestResponse<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                      "Project created successfully", project));
    }
}
