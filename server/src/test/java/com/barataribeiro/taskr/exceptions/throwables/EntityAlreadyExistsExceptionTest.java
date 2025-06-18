package com.barataribeiro.taskr.exceptions.throwables;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EntityAlreadyExistsExceptionTest {
    @Test
    @DisplayName("it should return CONFLICT status and correct detail")
    void toProblemDetailReturnsConflictStatusAndCorrectDetail() {
        EntityAlreadyExistsException ex = new EntityAlreadyExistsException("User");
        ProblemDetail detail = ex.toProblemDetail();

        assertEquals(HttpStatus.CONFLICT.value(), detail.getStatus());
        assertEquals("Resource already exists", detail.getTitle());
        assertEquals("User already exists", detail.getDetail());
    }

}