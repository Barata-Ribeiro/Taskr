package com.barataribeiro.taskr.services.security;

import com.barataribeiro.taskr.models.entities.User;

import java.time.Instant;
import java.util.Map;

public interface TokenService {
    Map.Entry<String, Instant> generateToken(User user, Boolean rememberMe);

    String validateToken(String token);
}