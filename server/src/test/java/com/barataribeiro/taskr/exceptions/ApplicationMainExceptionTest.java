package com.barataribeiro.taskr.exceptions;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ApplicationMainExceptionTest {
    @Test
    @DisplayName("it should return INTERNAL_SERVER_ERROR status and default title")
    void toProblemDetailReturnsInternalServerErrorStatusAndDefaultTitle() {
        ApplicationMainException ex = new ApplicationMainException();
        ProblemDetail detail = ex.toProblemDetail();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), detail.getStatus());
        assertEquals("Internal Server Error", detail.getTitle());
    }
}