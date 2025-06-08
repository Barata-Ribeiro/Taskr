package com.barataribeiro.taskr.config.security;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@TestPropertySource(properties = "CORS_ORIGINS=http://localhost:3000,http://localhost:8080,http://localhost:4200")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class CorsConfigTest {
    private final MockMvcTester mockMvcTester;
    
    @Test
    @DisplayName("CORS headers are set for allowed origin")
    void corsHeadersAreSetForAllowedOrigin() {
        mockMvcTester.get().uri("/").header("Origin", "http://localhost:3000")
                     .assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.NOT_FOUND)
                     .hasHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    }

    @Test
    @DisplayName("CORS headers are not set for disallowed origin")
    void corsHeadersAreNotSetForDisallowedOrigin() {
        mockMvcTester.get().uri("/").header("Origin", "http://malicious.com")
                     .assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.FORBIDDEN)
                     .doesNotContainHeader("Access-Control-Allow-Origin");
    }
}