package com.barataribeiro.taskr.exceptions;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class ApplicationExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    protected ProblemDetail handleAccessDenied(@NotNull AccessDeniedException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problemDetail.setTitle("Forbidden");
        problemDetail
                .setDetail(String.format("%s. You do not have sufficient privileges to access this resource.",
                                         ex.getMessage()));
        log.atError().log("Access denied: {}", ex.getMessage());
        return problemDetail;
    }

    @ExceptionHandler(ApplicationMainException.class)
    protected ProblemDetail handleInternalServerError(@NotNull ApplicationMainException ex) {
        log.atError().log("Internal server error: {}", ex.getMessage());
        return ex.toProblemDetail();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ProblemDetail handleMethodArgumentNotValid(@NotNull MethodArgumentNotValidException ex) {
        List<InvalidParam> fieldErrors = ex.getFieldErrors()
                                           .stream()
                                           .map(f -> new InvalidParam(f.getField(), f.getDefaultMessage()))
                                           .toList();

        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

        problemDetail.setTitle("Your request parameters didn't validate.");
        problemDetail.setProperty("invalid-params", fieldErrors);

        log.atError()
           .log("Invalid request parameters from Not Valid Method Argument: {}, {}", fieldErrors, ex.getMessage());

        return problemDetail;
    }

    @ExceptionHandler(ConstraintViolationException.class)
    protected ProblemDetail handleConstraintViolation(@NotNull ConstraintViolationException ex) {
        List<InvalidParam> fieldErrors = ex.getConstraintViolations()
                                           .stream()
                                           .map(f -> new InvalidParam(f.getPropertyPath().toString(), f.getMessage()))
                                           .toList();

        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

        problemDetail.setTitle("Your request parameters didn't validate.");
        problemDetail.setProperty("invalid-params", fieldErrors);

        log.atError().log("Invalid request parameters from Constraint Violation: {}, {}", fieldErrors, ex.getMessage());

        return problemDetail;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    protected ProblemDetail handleIllegalArgumentException(@NotNull IllegalArgumentException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problemDetail.setTitle("Invalid Request");
        problemDetail.setDetail(ex.getMessage());
        log.atError().log("Invalid request: {}", ex.getMessage());
        return problemDetail;
    }

    private record InvalidParam(String fieldName, String reason) {}
}