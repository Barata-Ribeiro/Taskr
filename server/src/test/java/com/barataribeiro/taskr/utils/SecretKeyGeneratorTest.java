package com.barataribeiro.taskr.utils;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Disabled
class SecretKeyGeneratorTest {

    Logger logger = LoggerFactory.getLogger(SecretKeyGeneratorTest.class);

    @Test
    void generateSecretKey() {
        int keyLength = 64;

        SecureRandom secureRandom = new SecureRandom();

        byte[] key = new byte[keyLength];
        secureRandom.nextBytes(key);

        StringBuilder secretKey = new StringBuilder();
        for (byte b : key) {
            secretKey.append(String.format("%02x", b));
        }

        logger.atInfo().log("Secret key: {}", secretKey);

        assertEquals(keyLength * 2, secretKey.length());
        assertEquals(128, secretKey.length());
        assertTrue(secretKey.toString().matches("[0-9a-f]+"));
    }
}