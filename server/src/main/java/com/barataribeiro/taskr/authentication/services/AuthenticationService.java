package com.barataribeiro.taskr.authentication.services;

import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.exceptions.throwables.EntityAlreadyExistsException;
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

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserBuilder userBuilder;

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
}
