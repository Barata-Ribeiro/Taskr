package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.taskr.user.dtos.UserAccountDTO;
import com.barataribeiro.taskr.user.dtos.UserUpdateRequestDTO;
import com.barataribeiro.taskr.user.enums.Roles;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserService {
    private final UserRepository userRepository;
    private final UserBuilder userBuilder;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserAccountDTO getAccountDetails(@NotNull Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        return userBuilder.toUserAccountDTO(user);
    }

    @Transactional
    public UserAccountDTO updateAccountDetails(@NotNull Authentication authentication,
                                               @NotNull UserUpdateRequestDTO body) {
        User userToUpdate = userRepository.findByUsername(authentication.getName())
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        boolean passwordMatches = passwordEncoder.matches(body.getCurrentPassword(), userToUpdate.getPassword());
        boolean userBannedOrNone =
                userToUpdate.getRole().equals(Roles.BANNED) || userToUpdate.getRole().equals(Roles.NONE);

        if (!passwordMatches || userBannedOrNone) {
            throw new InvalidCredentialsException("Authorization failed; Wrong credentials or account has a problem.");
        }

        verifyIfBodyExistsThenUpdateProperties(body, userToUpdate);

        return userBuilder.toUserAccountDTO(userRepository.saveAndFlush(userToUpdate));
    }

    private void verifyIfBodyExistsThenUpdateProperties(@NotNull UserUpdateRequestDTO body,
                                                        @NotNull User userToUpdate) {
        Optional.ofNullable(body.getUsername()).ifPresent(s -> {
            if (s.equals(userToUpdate.getUsername())) {
                throw new IllegalRequestException("Account already uses this username.");
            }

            if (userRepository.existsByUsernameOrEmailAllIgnoreCase(s, null)) {
                throw new IllegalRequestException("Username already in use.");
            }

            userToUpdate.setUsername(s);
        });

        Optional.ofNullable(body.getEmail()).ifPresent(s -> {
            if (s.equals(userToUpdate.getEmail())) {
                throw new IllegalRequestException("Account already uses this email.");
            }

            if (userRepository.existsByUsernameOrEmailAllIgnoreCase(null, s)) {
                throw new IllegalRequestException("Email already in use.");
            }

            userToUpdate.setEmail(s);
        });

        Optional.ofNullable(body.getDisplayName()).ifPresent(userToUpdate::setDisplayName);
        Optional.ofNullable(body.getFullName()).ifPresent(userToUpdate::setFullName);
        Optional.ofNullable(body.getAvatarUrl()).ifPresent(userToUpdate::setAvatarUrl);
        Optional.ofNullable(body.getNewPassword()).ifPresent(s -> userToUpdate.setPassword(passwordEncoder.encode(s)));
    }

    @Transactional
    public void deleteAccount(@NotNull Authentication authentication) {
        long wasDeleted = userRepository.deleteByUsername(authentication.getName());

        if (wasDeleted == 0) {
            throw new IllegalRequestException("Account deletion failed; Account not found or not authorized.");
        }
    }
}
