package com.barataribeiro.taskr.exceptions.handlers;

import com.barataribeiro.taskr.exceptions.RestErrorMessage;
import com.barataribeiro.taskr.exceptions.generics.BadRequest;
import com.barataribeiro.taskr.exceptions.generics.ForbiddenRequest;
import com.barataribeiro.taskr.exceptions.generics.InternalServerError;
import com.barataribeiro.taskr.exceptions.generics.UnauthorizedRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.stream.Collectors;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<RestErrorMessage> handleConstraintViolationException(ConstraintViolationException ex) {
        String errorMessage = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        RestErrorMessage restErrorMessage = new RestErrorMessage(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.value(), errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(restErrorMessage);
    }

    @ExceptionHandler(InternalServerError.class)
    private ResponseEntity<RestErrorMessage> internalServerError(InternalServerError exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
    }

    @ExceptionHandler(BadRequest.class)
    private ResponseEntity<RestErrorMessage> badRequest(BadRequest exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(ForbiddenRequest.class)
    private ResponseEntity<RestErrorMessage> forbiddenRequest(ForbiddenRequest exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.FORBIDDEN, HttpStatus.FORBIDDEN.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorMessage);
    }

    @ExceptionHandler(UnauthorizedRequest.class)
    private ResponseEntity<RestErrorMessage> unauthorizedRequest(UnauthorizedRequest exception) {
        RestErrorMessage errorMessage = new RestErrorMessage(HttpStatus.UNAUTHORIZED, HttpStatus.UNAUTHORIZED.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);
    }
}
