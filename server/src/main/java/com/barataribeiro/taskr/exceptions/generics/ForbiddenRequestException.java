package com.barataribeiro.taskr.exceptions.generics;

import com.barataribeiro.taskr.exceptions.TaskrMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class ForbiddenRequestException extends TaskrMainException {
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);

        problemDetail.setTitle("Forbidden");
        problemDetail.setDetail("You do not have sufficient privileges to access this resource.");

        return problemDetail;
    }
}
