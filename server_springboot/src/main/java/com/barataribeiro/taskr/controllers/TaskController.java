package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.dtos.task.TaskUpdateRequestDTO;
import com.barataribeiro.taskr.services.TaskService;
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
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/create-task")
    public ResponseEntity<RestResponseDTO> createTask(@PathVariable String projectId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task created successfully",
                                                     null));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO> getTaskInfo(@PathVariable String projectId,
                                                       @PathVariable String taskId) {
        Map<String, Object> response = taskService.getTaskInfo(projectId, taskId);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task retrieved successfully",
                                                     response));
    }

    @PutMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO> updateTask(@PathVariable String projectId, @PathVariable String taskId,
                                                      TaskUpdateRequestDTO body, Principal principal) {
        TaskDTO response = taskService.updateTask(projectId, taskId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task updated successfully",
                                                     null));
    }

    @DeleteMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO> deleteTask(@PathVariable String projectId, @PathVariable String taskId,
                                                      Principal principal) {
        taskService.deleteTask(projectId, taskId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task deleted successfully",
                                                     null));
    }
}
