package com.barataribeiro.taskr.authentication.services;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.LoginResponseDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.exceptions.throwables.EntityAlreadyExistsException;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.taskr.user.Roles;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Transactional(rollbackFor = Exception.class)
    public UserSecurityDTO createAccount(@Valid @NotNull RegistrationRequestDTO body) {
        if (userRepository.existsByUsernameOrEmailAllIgnoreCase(body.getUsername(), body.getEmail())) {
            throw new EntityAlreadyExistsException(User.class.getSimpleName());
        }

        User newUser = User.builder()
                           .username(body.getUsername())
                           .email(body.getEmail())
                           .displayName(body.getUsername())
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
}
