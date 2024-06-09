package com.barataribeiro.taskr.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CorsConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        System.setProperty("api.security.cors.origins", "http://localhost:3000,http://localhost:8080,http://localhost:4200");
    }

    @Test
    @DisplayName("CORS headers are set for allowed origin")
    public void corsHeadersAreSetForAllowedOrigin() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/")
                                .header("Origin", "http://localhost:3000"))
                .andExpect(status().isNotFound())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }

    @Test
    @DisplayName("CORS headers are not set for disallowed origin")
    public void corsHeadersAreNotSetForDisallowedOrigin() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/")
                                .header("Origin", "http://malicious.com"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}