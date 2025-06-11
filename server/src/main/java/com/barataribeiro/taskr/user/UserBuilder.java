package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserBuilder {
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public UserSecurityDTO toUserSecurityDTO(User user) {
        return modelMapper.map(user, UserSecurityDTO.class);
    }

    public User toUser(RegistrationRequestDTO body) {
        User user = modelMapper.map(body, User.class);
        user.setPassword(passwordEncoder.encode(body.getPassword()));
        return user;
    }
}
