package com.barataribeiro.taskr.services.security.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.taskr.exceptions.TaskrMainException;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.services.security.TokenService;
import com.barataribeiro.taskr.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.AbstractMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TokenServiceImpl implements TokenService {

    @Value("${api.security.token.secret}")
    private String secretKey;

    @Override
    public Map.Entry<String, Instant> generateAccessToken(@NotNull User user) {
        Instant expirationDate;
        String token;

        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            expirationDate = this.generateExpirationDateOfFifteenMinutes();

            token = JWT.create()
                       .withIssuer(AppConstants.AUTH_0)
                       .withSubject(user.getUsername())
                       .withClaim("role", user.getRole().name())
                       .withExpiresAt(expirationDate)
                       .sign(algorithm);

            return new AbstractMap.SimpleEntry<>(token, expirationDate);
        } catch (IllegalArgumentException | JWTCreationException exception) {
            log.atError().log(exception.getMessage());
            throw new TaskrMainException();
        }
    }

    @Override
    public Map.Entry<String, Instant> generateRefreshToken(@NotNull User user, Boolean rememberMe) {
        Instant expirationDate;
        String token;

        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            expirationDate = this.generateExpirationDateInDays(rememberMe != null && rememberMe ? 30 : 1);

            String tokenId = UUID.randomUUID().toString();

            token = JWT.create()
                       .withIssuer(AppConstants.AUTH_0)
                       .withSubject(user.getUsername())
                       .withExpiresAt(expirationDate)
                       .withClaim("role", user.getRole().name())
                       .withJWTId(tokenId)
                       .sign(algorithm);

            return new AbstractMap.SimpleEntry<>(token, expirationDate);
        } catch (IllegalArgumentException | JWTCreationException exception) {
            log.atError().log(exception.getMessage());
            throw new TaskrMainException();
        }
    }

    @Override
    public DecodedJWT validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            JWTVerifier verifier = JWT.require(algorithm).withIssuer(AppConstants.AUTH_0).build();

            return verifier.verify(token);
        } catch (JWTVerificationException exception) {
            log.atError().log("Invalid token: {}", exception.getMessage());
            return null;
        }
    }

    private Instant generateExpirationDateOfFifteenMinutes() {
        return LocalDateTime.now(ZoneOffset.UTC).plusMinutes(15).toInstant(ZoneOffset.UTC);
    }

    private Instant generateExpirationDateInDays(Integer days) {
        return LocalDateTime.now(ZoneOffset.UTC).plusDays(days).toInstant(ZoneOffset.UTC);
    }
}
