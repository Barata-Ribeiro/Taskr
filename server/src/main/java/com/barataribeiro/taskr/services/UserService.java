package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.user.UpdateAccountRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;

import java.security.Principal;
import java.util.Map;

public interface UserService {
    UserDTO getUserProfileById(String id);

    Map<String, Object> getUserContext(Principal principal);

    UserDTO updateUserProfile(String id, UpdateAccountRequestDTO body, Principal principal);

    void deleteUserProfile(String id, Principal principal);
}
