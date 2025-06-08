package com.barataribeiro.taskr.exceptions.throwables;

import com.barataribeiro.taskr.exceptions.ApplicationMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class EntityAlreadyExistsException extends ApplicationMainException {
    private final String entityName;

    public EntityAlreadyExistsException(String entityName) {
        this.entityName = entityName;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.CONFLICT);

        problemDetail.setTitle("Resource already exists");
        problemDetail.setDetail(entityName + " already exists");

        return problemDetail;
    }
}
