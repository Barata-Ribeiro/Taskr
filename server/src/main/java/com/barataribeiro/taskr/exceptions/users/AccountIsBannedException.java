package com.barataribeiro.taskr.exceptions.users;

import com.barataribeiro.taskr.exceptions.TaskrMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class AccountIsBannedException extends TaskrMainException {
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);

        problemDetail.setTitle("Forbidden");
        problemDetail.setDetail("Your account has been banned.");

        return problemDetail;
    }
}
