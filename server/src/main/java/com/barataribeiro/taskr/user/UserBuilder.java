package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserBuilder {
    private final ModelMapper modelMapper;

    public UserSecurityDTO toUserSecurityDTO(User user) {
        return modelMapper.map(user, UserSecurityDTO.class);
    }
}
