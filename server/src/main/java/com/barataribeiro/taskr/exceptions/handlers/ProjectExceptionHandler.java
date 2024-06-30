package com.barataribeiro.taskr.exceptions.handlers;

import com.barataribeiro.taskr.exceptions.RestErrorMessage;
import com.barataribeiro.taskr.exceptions.project.ProjectAlreadyExists;
import com.barataribeiro.taskr.exceptions.project.ProjectLimitReached;
import com.barataribeiro.taskr.exceptions.project.ProjectNotFound;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ProjectExceptionHandler {
    @ExceptionHandler(ProjectNotFound.class)
    private ResponseEntity<RestErrorMessage> projectNotFound(ProjectNotFound exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }

    @ExceptionHandler(ProjectAlreadyExists.class)
    private ResponseEntity<RestErrorMessage> projectAlreadyExists(ProjectAlreadyExists exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.CONFLICT, HttpStatus.CONFLICT.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
    }

    @ExceptionHandler(ProjectLimitReached.class)
    private ResponseEntity<RestErrorMessage> projectLimitReached(ProjectLimitReached exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.CONFLICT, HttpStatus.CONFLICT.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorMessage);
    }
}
