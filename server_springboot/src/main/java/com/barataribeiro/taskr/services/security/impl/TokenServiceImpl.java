package com.barataribeiro.taskr.services.security.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.AbstractMap;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TokenServiceImpl implements TokenService {
    @Value("${api.security.token.secret}")
    private String secret_key;

    @Override
    public Map.Entry<String, Instant> generateRefreshToken(@NotNull User user, Boolean rememberMe) {
        Instant expirationDate;
        String token;

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret_key);
            expirationDate = this.generateExpirationDateInDays(rememberMe != null && rememberMe ? 365 : 1);

            token = JWT.create()
                    .withIssuer("auth0")
                    .withSubject(user.getUsername())
                    .withExpiresAt(expirationDate)
                    .sign(algorithm);

            return new AbstractMap.SimpleEntry<>(token, expirationDate);
        } catch (IllegalArgumentException | JWTCreationException exception) {
            System.err.println(exception.getMessage());
            throw new RuntimeException(exception);
        }
    }

    @Override
    public Map.Entry<String, Instant> generateAccessToken(@NotNull User user) {
        Instant expirationDate;
        String token;

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret_key);
            expirationDate = this.generateExpirationDateInMinutes();

            token = JWT.create()
                    .withIssuer("auth0")
                    .withSubject(user.getUsername())
                    .withExpiresAt(expirationDate)
                    .sign(algorithm);

            return new AbstractMap.SimpleEntry<>(token, expirationDate);
        } catch (IllegalArgumentException | JWTCreationException exception) {
            System.err.println(exception.getMessage());
            throw new RuntimeException(exception);
        }
    }

    @Override
    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret_key);

            return JWT.require(algorithm)
                    .withIssuer("auth0")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            System.err.println(exception.getMessage());
            return null;
        }
    }

    private Instant generateExpirationDateInDays(Integer days) {
        return LocalDateTime.now(ZoneOffset.UTC).plusDays(days).toInstant(ZoneOffset.UTC);
    }

    private Instant generateExpirationDateInHours(int hours) {
        return LocalDateTime.now(ZoneOffset.UTC).plusHours(hours).toInstant(ZoneOffset.UTC);
    }

    private Instant generateExpirationDateInMinutes() {
        return LocalDateTime.now(ZoneOffset.UTC).plusMinutes(15).toInstant(ZoneOffset.UTC);
    }
}
