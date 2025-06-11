package com.barataribeiro.taskr.config.security;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class SecurityConfigTest {
    private final MockMvcTester mockMvcTester;

    @Test
    @DisplayName("Security headers are set correctly")
    void securityHeadersAreSet() {
        mockMvcTester.post().uri("/api/v1/auth/login")
                     .assertThat()
                     .hasFailed()
                     .hasHeader("X-Content-Type-Options", "nosniff")
                     .hasHeader("X-XSS-Protection", "1; mode=block")
                     .hasHeader("Content-Security-Policy",
                                "script-src 'self'; frame-ancestors 'self'; upgrade-insecure-requests")
                     .hasHeader("X-Frame-Options", "SAMEORIGIN")
                     .hasHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    }

}
