package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.auth.*;
import com.barataribeiro.taskr.exceptions.user.PasswordDoesNotMatch;
import com.barataribeiro.taskr.exceptions.user.UserAlreadyExists;
import com.barataribeiro.taskr.exceptions.user.UserIsBanned;
import com.barataribeiro.taskr.exceptions.user.UserNotFound;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.Roles;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.services.AuthService;
import com.barataribeiro.taskr.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    public LoginResponseDTO login(@NotNull LoginRequestDTO body) {
        User user = userRepository.findByUsername(body.username()).orElseThrow(UserNotFound::new);

        boolean passwordMatches = passwordEncoder.matches(body.password(), user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) {
            throw new UserIsBanned();
        }

        if (!passwordMatches) {
            throw new PasswordDoesNotMatch();
        }

        Map.Entry<String, Instant> accessTokenAndExpiration = tokenService.generateAccessToken(user);
        Map.Entry<String, Instant> refreshTokenAndExpiration = tokenService.generateRefreshToken(user,
                                                                                                 body.rememberMe());

        return new LoginResponseDTO(userMapper.toDTO(user),
                                    accessTokenAndExpiration.getKey(),
                                    refreshTokenAndExpiration.getKey(),
                                    refreshTokenAndExpiration.getValue());
    }

    @Override
    @Transactional
    public RegisterResponseDTO register(@NotNull RegisterRequestDTO body) {
        String username = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
        String displayName = StringEscapeUtils.escapeHtml4(body.displayName().strip());
        String email = StringEscapeUtils.escapeHtml4(body.email().strip());

        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            throw new UserAlreadyExists();
        }

        User user = User.builder()
                .username(username)
                .displayName(displayName)
                .email(email)
                .password(passwordEncoder.encode(body.password()))
                .build();

        User savedUser = userRepository.save(user);

        return new RegisterResponseDTO(userMapper.toDTO(savedUser));
    }

    @Override
    public RefreshTokenResponseDTO refreshToken(String refreshToken) {
        String validatedToken = tokenService.validateToken(refreshToken);
        User user = userRepository.findByUsername(validatedToken).orElseThrow(UserNotFound::new);
        Map.Entry<String, Instant> newAccessToken = tokenService.generateAccessToken(user);
        return new RefreshTokenResponseDTO(newAccessToken.getKey());
    }
}
