package com.barataribeiro.taskr.exceptions;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    protected ProblemDetail handleAccessDenied(@NotNull AccessDeniedException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problemDetail.setTitle("Forbidden");
        problemDetail.setDetail(
                String.format("%s. You do not have sufficient privileges to access this resource.", ex.getMessage()));

        log.atError().log("Access denied: {}", ex.getMessage());

        return problemDetail;
    }

    @ExceptionHandler(TaskrMainException.class)
    protected ProblemDetail handleInternalServerError(@NotNull TaskrMainException ex) {
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

        log.atError().log("Invalid request parameters: {}, {}", fieldErrors, ex.getMessage());

        return problemDetail;
    }

    private void writeResponse(@NotNull HttpServletResponse response,
                               @NotNull ProblemDetail problemDetail) throws IOException {
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setContentType("application/json");
        response.getWriter().write(problemDetail.toString());
    }

    private record InvalidParam(String fieldName, String reason) {}
}