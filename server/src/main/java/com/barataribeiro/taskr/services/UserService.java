package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.user.UpdateAccountRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;

import java.security.Principal;

public interface UserService {
    UserDTO getUserProfileById(String id);

    UserDTO getUserContext(String id, Principal principal);

    UserDTO updateUserProfile(String id, UpdateAccountRequestDTO body, Principal principal);

    void deleteUserProfile(String id, Principal principal);
}
