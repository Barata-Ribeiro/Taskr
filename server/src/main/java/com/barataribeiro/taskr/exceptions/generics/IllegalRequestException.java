package com.barataribeiro.taskr.exceptions.generics;

import com.barataribeiro.taskr.exceptions.TaskrMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class IllegalRequestException extends TaskrMainException {
    private final String detail;

    public IllegalRequestException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

        problemDetail.setTitle("Illegal Request");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}
