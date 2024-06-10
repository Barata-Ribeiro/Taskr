package com.barataribeiro.taskr.services;


import com.barataribeiro.taskr.dtos.auth.LoginRequestDTO;
import com.barataribeiro.taskr.dtos.auth.LoginResponseDTO;
import com.barataribeiro.taskr.dtos.auth.RegisterRequestDTO;
import com.barataribeiro.taskr.dtos.auth.RegisterResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO body);

    RegisterResponseDTO register(RegisterRequestDTO body);
}
