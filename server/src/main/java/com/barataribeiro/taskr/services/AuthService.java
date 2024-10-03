package com.barataribeiro.taskr.services;


import com.barataribeiro.taskr.dtos.auth.LoginRequestDTO;
import com.barataribeiro.taskr.dtos.auth.LoginResponseDTO;
import com.barataribeiro.taskr.dtos.auth.RegisterRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO body);

    UserDTO register(RegisterRequestDTO body);

    LoginResponseDTO refreshToken(String refreshToken);

    void logout(String refreshToken);
}
