package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.task.dtos.TaskRequestDTO;
import com.barataribeiro.taskr.task.dtos.TaskUpdateRequestDTO;
import com.barataribeiro.taskr.task.dtos.TasksByStatusDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Tasks", description = "Endpoints for managing tasks")
public class TaskController {
    private final TaskService taskService;

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all tasks for a project",
               description = "Retrieves all tasks associated with a specific project, separated by their status.")
    public ResponseEntity<RestResponse<TasksByStatusDTO>> getTasksByProject(@PathVariable Long projectId,
                                                                            Authentication authentication) {
        TasksByStatusDTO tasks = taskService.getTasksByProject(projectId, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Tasks retrieved successfully", tasks));
    }

    @GetMapping("/project/{projectId}/latest")
    @Operation(summary = "Get latest tasks for a project",
               description = "Retrieves the latest tasks associated with a specific project.")
    public ResponseEntity<RestResponse<Set<TaskDTO>>> getLatestTasksByProject(@PathVariable Long projectId,
                                                                              Authentication authentication) {
        Set<TaskDTO> tasks = taskService.getLatestTasksByProject(projectId, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Latest tasks retrieved successfully", tasks));
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

    @PatchMapping("/{taskId}")
    @Operation(summary = "Update an existing task",
               description = "Updates the details of an existing task.")
    public ResponseEntity<RestResponse<TaskDTO>> updateTask(@PathVariable Long taskId,
                                                            @RequestBody @Valid TaskUpdateRequestDTO body,
                                                            Authentication authentication) {
        TaskDTO task = taskService.updateTask(taskId, body, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Task updated successfully", task));
    }

    @DeleteMapping("/{taskId}/project/{projectId}")
    @Operation(summary = "Delete a task",
               description = "Deletes a task by its unique identifier.")
    public ResponseEntity<RestResponse<Void>> deleteTask(@PathVariable Long taskId, @PathVariable Long projectId,
                                                         Authentication authentication) {
        taskService.deleteTask(taskId, projectId, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                      "Task deleted successfully", null));
    }
}
