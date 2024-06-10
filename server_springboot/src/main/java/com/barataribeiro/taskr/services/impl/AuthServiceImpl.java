package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.auth.LoginRequestDTO;
import com.barataribeiro.taskr.dtos.auth.LoginResponseDTO;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.Roles;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.services.AuthService;
import com.barataribeiro.taskr.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        User user = userRepository.findByUsername(body.username()).orElseThrow(null);

        boolean passwordMatches = passwordEncoder.matches(body.password(), user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        Map.Entry<String, Instant> accessTokenAndExpiration = tokenService.generateAccessToken(user);
        Map.Entry<String, Instant> refreshTokenAndExpiration = tokenService.generateRefreshToken(user, body.rememberMe());


        return new LoginResponseDTO(userMapper.toDTO(user),
                                    accessTokenAndExpiration.getKey(),
                                    refreshTokenAndExpiration.getKey(),
                                    refreshTokenAndExpiration.getValue());
    }
}
