package com.barataribeiro.taskr.exceptions.throwables;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InvalidCredentialsExceptionTest {
    @Test
    @DisplayName("it should return UNAUTHORIZED status and provided detail")
    void toProblemDetailReturnsUnauthorizedStatusAndProvidedDetail() {
        InvalidCredentialsException ex = new InvalidCredentialsException("Wrong password");
        ProblemDetail detail = ex.toProblemDetail();

        assertEquals(HttpStatus.UNAUTHORIZED.value(), detail.getStatus());
        assertEquals("Invalid Credentials", detail.getTitle());
        assertEquals("Wrong password", detail.getDetail());
    }
}