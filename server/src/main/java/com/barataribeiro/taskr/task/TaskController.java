package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.task.dtos.TaskRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Tasks", description = "Endpoints for managing tasks")
public class TaskController {
    private final TaskService taskService;

    @GetMapping("/{taskId}/project/{projectId}")
    @Operation(summary = "Get task by ID",
               description = "Retrieves a task by its unique identifier.")
    public ResponseEntity<RestResponse<TaskDTO>> getTaskById(@PathVariable Long taskId,
                                                             @PathVariable Long projectId,
                                                             Authentication authentication) {
        TaskDTO task = taskService.getTaskById(taskId, projectId, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Task retrieved successfully", task));
    }

    @PostMapping
    @Operation(summary = "Create a new task",
               description = "Creates a new task within a specified project.")
    public ResponseEntity<RestResponse<TaskDTO>> createTask(@RequestBody @Valid TaskRequestDTO body,
                                                            Authentication authentication) {
        TaskDTO task = taskService.createTask(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new RestResponse<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                      "Task created successfully", task));
    }
}
