package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.auth.*;
import com.barataribeiro.taskr.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<RestResponseDTO> login(@RequestBody LoginRequestDTO body) {
        LoginResponseDTO response = authService.login(body);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Login successful",
                                                     response));
    }

    @PostMapping("/register")
    public ResponseEntity<RestResponseDTO> register(@RequestBody RegisterRequestDTO body) {
        RegisterResponseDTO response = authService.register(body);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Registration successful",
                                                     response));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RestResponseDTO> refreshToken(@RequestHeader("x-refresh-token") String refreshToken) {
        RefreshTokenResponseDTO response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Token refreshed",
                                                     response));
    }
}
