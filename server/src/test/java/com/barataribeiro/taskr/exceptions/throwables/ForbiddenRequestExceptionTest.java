package com.barataribeiro.taskr.exceptions.throwables;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ForbiddenRequestExceptionTest {
    @Test
    @DisplayName("it should return FORBIDDEN status and correct detail")
    void toProblemDetailReturnsForbiddenStatusAndCorrectDetail() {
        ForbiddenRequestException ex = new ForbiddenRequestException();
        ProblemDetail detail = ex.toProblemDetail();

        assertEquals(HttpStatus.FORBIDDEN.value(), detail.getStatus());
        assertEquals("Forbidden", detail.getTitle());
        assertEquals("You do not have sufficient privileges to access this resource.", detail.getDetail());
    }
}