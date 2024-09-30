package com.barataribeiro.taskr.exceptions.users;

import com.barataribeiro.taskr.exceptions.TaskrMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class InvalidAccountCredentialsException extends TaskrMainException {
    private final String detail;

    public InvalidAccountCredentialsException(String detail) {
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
