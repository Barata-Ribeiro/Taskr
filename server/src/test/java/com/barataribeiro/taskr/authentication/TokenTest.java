package com.barataribeiro.taskr.authentication;

import com.barataribeiro.taskr.features.authentication.Token;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TokenTest {

    @Test
    @DisplayName("Token builder sets all fields correctly")
    void builderSetsAllFieldsCorrectly() {
        Instant now = Instant.now();
        Token token = Token.builder()
                           .id("jti-123")
                           .tokenValue("token-value-abc")
                           .ownerUsername("user1")
                           .expirationDate(now)
                           .blacklistedAt(now)
                           .build();

        assertEquals("jti-123", token.getId());
        assertEquals("token-value-abc", token.getTokenValue());
        assertEquals("user1", token.getOwnerUsername());
        assertEquals(now, token.getExpirationDate());
        assertEquals(now, token.getBlacklistedAt());
    }

    @Test
    @DisplayName("Token equals and hashCode with same values")
    void equalsAndHashCodeWithSameValues() {
        Instant now = Instant.now();
        Token token1 = Token.builder()
                            .id("jti-1")
                            .tokenValue("val1")
                            .ownerUsername("userA")
                            .expirationDate(now)
                            .blacklistedAt(now)
                            .build();
        Token token2 = Token.builder()
                            .id("jti-1")
                            .tokenValue("val1")
                            .ownerUsername("userA")
                            .expirationDate(now)
                            .blacklistedAt(now)
                            .build();

        assertEquals(token1, token2);
        assertEquals(token1.hashCode(), token2.hashCode());
    }
}