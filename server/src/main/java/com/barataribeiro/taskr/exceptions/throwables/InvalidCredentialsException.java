package com.barataribeiro.taskr.exceptions.throwables;

import com.barataribeiro.taskr.exceptions.ApplicationMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class InvalidCredentialsException extends ApplicationMainException {
    private final String detail;

    public InvalidCredentialsException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);

        problemDetail.setTitle("Invalid Credentials");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}