package com.barataribeiro.taskr.authentication.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.taskr.authentication.Token;
import com.barataribeiro.taskr.authentication.TokenRepository;
import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.LoginResponseDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.exceptions.throwables.EntityAlreadyExistsException;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import com.barataribeiro.taskr.user.enums.Roles;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserBuilder userBuilder;
    private final TokenService tokenService;
    private final TokenRepository tokenRepository;

    @Transactional(rollbackFor = Exception.class)
    @CacheEvict(value = {"globalStats", "projectStats", "userStats"}, allEntries = true)
    public UserSecurityDTO createAccount(@Valid @NotNull RegistrationRequestDTO body) {
        if (userRepository.existsByUsernameOrEmailAllIgnoreCase(body.getUsername(), body.getEmail())) {
            throw new EntityAlreadyExistsException(User.class.getSimpleName());
        }

        User newUser = User.builder()
                           .username(body.getUsername())
                           .email(body.getEmail())
                           .displayName(body.getDisplayName())
                           .password(passwordEncoder.encode(body.getPassword()))
                           .build();

        return userBuilder.toUserSecurityDTO(userRepository.saveAndFlush(newUser));
    }

    @Transactional(rollbackFor = Exception.class)
    public LoginResponseDTO loginUser(@Valid @NotNull LoginRequestDTO body) {
        User user = userRepository.findUserByUsernameOrEmailAllIgnoreCase(body.getUsernameOrEmail())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        boolean passwordMatches = passwordEncoder.matches(body.getPassword(), user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) {
            throw new IllegalRequestException("Account is banned or has a problem. Please contact support.");
        }

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Login failed; Wrong username/email or password.");
        }

        Map.Entry<String, Instant> accessToken = tokenService.generateAccessToken(user);
        Map.Entry<String, Instant> refreshToken = tokenService.generateRefreshToken(user, body.getRememberMe());

        return new LoginResponseDTO(userBuilder.toUserSecurityDTO(user), accessToken.getKey(), accessToken.getValue(),
                                    refreshToken.getKey(), refreshToken.getValue());
    }

    @Transactional(rollbackFor = Exception.class, readOnly = true)
    public LoginResponseDTO refreshToken(String refreshToken) {
        DecodedJWT decodedJWT = tokenService.validateToken(refreshToken);

        if (decodedJWT == null) {
            throw new InvalidCredentialsException("Invalid or expired refresh token.");
        }

        String username = decodedJWT.getSubject();
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Map.Entry<String, Instant> accessTokenEntry = tokenService.generateAccessToken(user);

        return new LoginResponseDTO(userBuilder.toUserSecurityDTO(user), accessTokenEntry.getKey(),
                                    accessTokenEntry.getValue(), null, null);
    }

    @Transactional(rollbackFor = Exception.class)
    public void logoutUser(String refreshToken) {
        if (tokenService.validateToken(refreshToken) == null) {
            throw new InvalidCredentialsException("Invalid or expired refresh token.");
        }

        DecodedJWT decodedJWT = JWT.decode(refreshToken);

        Token blackListedToken = Token.builder()
                                      .id(decodedJWT.getId())
                                      .tokenValue(decodedJWT.getToken())
                                      .ownerUsername(decodedJWT.getSubject())
                                      .expirationDate(decodedJWT.getExpiresAt().toInstant())
                                      .build();

        tokenRepository.save(blackListedToken);
    }
}
