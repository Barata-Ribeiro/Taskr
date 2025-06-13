package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
