package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks/{projectId}")
public class TaskController {
    @PostMapping("/create-task")
    public ResponseEntity<RestResponseDTO> createTask(@PathVariable String projectId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task created successfully",
                                                     null));
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO> getTaskById(@PathVariable String projectId, @PathVariable String taskId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task retrieved successfully",
                                                     null));
    }

    @PutMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO> updateTask(@PathVariable String projectId, @PathVariable String taskId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task updated successfully",
                                                     null));
    }

    @DeleteMapping("/task/{taskId}")
    public ResponseEntity<RestResponseDTO> deleteTask(@PathVariable String projectId, @PathVariable String taskId) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Task deleted successfully",
                                                     null));
    }
}
