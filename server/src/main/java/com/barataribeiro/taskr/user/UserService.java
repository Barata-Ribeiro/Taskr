package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.user.dtos.UserAccountDTO;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserService {
    private final UserRepository userRepository;
    private final UserBuilder userBuilder;

    @Transactional(readOnly = true)
    public UserAccountDTO getAccountDetails(@NotNull Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        return userBuilder.toUserAccountDTO(user);
    }
}
