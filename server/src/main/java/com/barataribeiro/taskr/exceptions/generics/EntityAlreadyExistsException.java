package com.barataribeiro.taskr.exceptions.generics;

import com.barataribeiro.taskr.exceptions.TaskrMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class EntityAlreadyExistsException extends TaskrMainException {
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
