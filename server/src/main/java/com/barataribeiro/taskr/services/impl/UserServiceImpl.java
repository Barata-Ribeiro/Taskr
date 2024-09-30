package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.user.UpdateAccountRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.UnauthorizedRequest;
import com.barataribeiro.taskr.exceptions.user.PasswordDoesNotMatch;
import com.barataribeiro.taskr.exceptions.user.UserAlreadyExists;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO getUserProfileById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User"));
        return userMapper.toDTO(user);
    }

    @Override
    public UserDTO getUserContext(@NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(
                () -> new EntityNotFoundException("User"));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateUserProfile(String id, UpdateAccountRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(
                () -> new EntityNotFoundException("User"));

        if (!user.getId().equals(id)) {
            throw new UnauthorizedRequest();
        }

        if (!user.getPassword().equals(body.currentPassword())) {
            throw new PasswordDoesNotMatch();
        }

        if (userRepository.existsByUsername(body.username()) && !user.getUsername().equals(body.username())) {
            throw new UserAlreadyExists();
        }

        String username = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
        String displayName = StringEscapeUtils.escapeHtml4(body.displayName().strip());

        user.setUsername(username);
        user.setDisplayName(displayName);
        user.setPassword(passwordEncoder.encode(body.newPassword()));

        User savedUser = userRepository.saveAndFlush(user);

        return userMapper.toDTO(savedUser);
    }

    @Override
    @Transactional
    public void deleteUserProfile(String id, @NotNull Principal principal) {
        if (!userRepository.existsByIdAndUsername(id, principal.getName())) {
            throw new EntityNotFoundException("User");
        }

        userRepository.deleteByIdAndUsername(id, principal.getName());
    }
}
