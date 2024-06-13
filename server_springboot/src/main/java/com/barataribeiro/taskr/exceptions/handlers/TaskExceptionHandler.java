package com.barataribeiro.taskr.exceptions.handlers;

import com.barataribeiro.taskr.exceptions.RestErrorMessage;
import com.barataribeiro.taskr.exceptions.task.TaskNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class TaskExceptionHandler {

    @ExceptionHandler(TaskNotFound.class)
    private ResponseEntity<RestErrorMessage> taskNotFound(TaskNotFound exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }
}
