package com.barataribeiro.taskr.services;


import com.barataribeiro.taskr.dtos.auth.*;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO body);

    RegisterResponseDTO register(RegisterRequestDTO body);

    RefreshTokenResponseDTO refreshToken(String refreshToken);
}
