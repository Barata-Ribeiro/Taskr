package com.barataribeiro.taskr.exceptions.throwables;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.junit.jupiter.api.Assertions.assertEquals;

class IllegalRequestExceptionTest {
    @Test
    @DisplayName("it should return BAD_REQUEST status and provided detail")
    void toProblemDetailReturnsBadRequestStatusAndProvidedDetail() {
        IllegalRequestException ex = new IllegalRequestException("Invalid input");
        ProblemDetail detail = ex.toProblemDetail();

        assertEquals(HttpStatus.BAD_REQUEST.value(), detail.getStatus());
        assertEquals("Illegal Request", detail.getTitle());
        assertEquals("Invalid input", detail.getDetail());
    }
}