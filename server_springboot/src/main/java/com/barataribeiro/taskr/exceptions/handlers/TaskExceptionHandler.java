package com.barataribeiro.taskr.exceptions.handlers;

import com.barataribeiro.taskr.exceptions.RestErrorMessage;
import com.barataribeiro.taskr.exceptions.task.AlreadyDueDate;
import com.barataribeiro.taskr.exceptions.task.TaskNotFound;
import com.barataribeiro.taskr.exceptions.task.WrongDueDateFormat;
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

    @ExceptionHandler(WrongDueDateFormat.class)
    private ResponseEntity<RestErrorMessage> wrongDueDateFormat(WrongDueDateFormat exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(AlreadyDueDate.class)
    private ResponseEntity<RestErrorMessage> alreadyDueDate(AlreadyDueDate exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }
}
