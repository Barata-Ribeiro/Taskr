package com.barataribeiro.taskr.exceptions.generics;

import com.barataribeiro.taskr.exceptions.TaskrMainException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class EntityNotFoundException extends TaskrMainException {
    private final String entityName;

    public EntityNotFoundException(String entityName) {
        this.entityName = entityName;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setTitle("Resource not found");
        problemDetail.setDetail(entityName + " was not found or does not exist");

        return problemDetail;
    }
}
