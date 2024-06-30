package com.barataribeiro.taskr.services.security;

import com.barataribeiro.taskr.models.entities.User;

import java.time.Instant;
import java.util.Map;

public interface TokenService {
    Map.Entry<String, Instant> generateRefreshToken(User user, Boolean rememberMe);

    Map.Entry<String, Instant> generateAccessToken(User user);

    String validateToken(String token);
}