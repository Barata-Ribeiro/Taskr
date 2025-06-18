package com.barataribeiro.taskr.exceptions.throwables;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EntityNotFoundExceptionTest {
    @Test
    @DisplayName("it should return NOT_FOUND status and correct detail")
    void toProblemDetailReturnsNotFoundStatusAndCorrectDetail() {
        EntityNotFoundException ex = new EntityNotFoundException("Task");
        ProblemDetail detail = ex.toProblemDetail();

        assertEquals(HttpStatus.NOT_FOUND.value(), detail.getStatus());
        assertEquals("Resource not found", detail.getTitle());
        assertEquals("Task was not found or does not exist", detail.getDetail());
    }
}