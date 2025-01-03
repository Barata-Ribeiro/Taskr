package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.task.TaskCreateRequestDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.dtos.task.TaskUpdateRequestDTO;
import com.barataribeiro.taskr.services.TaskService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tasks/{projectId}")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Tag(name = "Task", description = "Task related operations")
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/create-task")
    public ResponseEntity<RestResponseDTO<TaskDTO>> createTask(@PathVariable String projectId,
                                                               @RequestBody TaskCreateRequestDTO body,
                                                               Principal principal) {
        TaskDTO response = taskService.createTask(projectId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Task created successfully",
                                                       response));
    }

    @GetMapping
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getProjectTasks(@PathVariable String projectId,
                                                                                Principal principal) {
        Map<String, Object> response = taskService.getProjectTasks(projectId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Project tasks retrieved successfully",
                                                       response));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getTaskInfo(@PathVariable String projectId,
                                                                            @PathVariable String taskId) {
        Map<String, Object> response = taskService.getTaskInfo(projectId, taskId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Task retrieved successfully",
                                                       response));
    }

    @PatchMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO<TaskDTO>> updateTask(@PathVariable String projectId,
                                                               @PathVariable String taskId,
                                                               @RequestBody TaskUpdateRequestDTO body,
                                                               Principal principal) {
        TaskDTO response = taskService.updateTask(projectId, taskId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Task updated successfully",
                                                       response));
    }

    @PatchMapping("/task/{taskId}/assign")
    public ResponseEntity<RestResponseDTO<TaskDTO>> assignTask(@PathVariable String projectId,
                                                               @PathVariable String taskId,
                                                               @RequestParam String username,
                                                               Principal principal) {
        TaskDTO response = taskService.assignTask(projectId, taskId, username, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Task assigned successfully",
                                                       response));
    }

    @DeleteMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO<Void>> deleteTask(@PathVariable String projectId, @PathVariable String taskId,
                                                            Principal principal) {
        taskService.deleteTask(projectId, taskId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                       HttpStatus.NO_CONTENT.value(),
                                                       "Task deleted successfully",
                                                       null));
    }
}
