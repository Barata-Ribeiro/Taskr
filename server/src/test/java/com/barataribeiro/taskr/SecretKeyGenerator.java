package com.barataribeiro.taskr;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.security.SecureRandom;

@Slf4j
public class SecretKeyGenerator {
    @Test
    public void generateSecretKey() {
        int keyLength = 64;

        SecureRandom secureRandom = new SecureRandom();

        byte[] key = new byte[keyLength];
        secureRandom.nextBytes(key);

        StringBuilder secretKey = new StringBuilder();
        for (byte b : key) {
            secretKey.append(String.format("%02x", b));
        }

        log.atInfo().log("Secret key: {}", secretKey);
    }
}
