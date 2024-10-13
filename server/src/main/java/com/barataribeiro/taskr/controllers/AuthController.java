package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.auth.LoginRequestDTO;
import com.barataribeiro.taskr.dtos.auth.LoginResponseDTO;
import com.barataribeiro.taskr.dtos.auth.RegisterRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
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
    public ResponseEntity<RestResponseDTO<LoginResponseDTO>> login(@RequestBody LoginRequestDTO body) {
        LoginResponseDTO response = authService.login(body);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Login successful",
                                                       response));
    }

    @PostMapping("/register")
    public ResponseEntity<RestResponseDTO<UserDTO>> register(@RequestBody RegisterRequestDTO body) {
        UserDTO response = authService.register(body);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       "Registration successful",
                                                       response));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<RestResponseDTO<LoginResponseDTO>> refreshToken(@RequestHeader("X-Refresh-Token")
                                                                          String refreshToken) {
        LoginResponseDTO response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Token refreshed",
                                                       response));
    }

    @DeleteMapping("/logout")
    public ResponseEntity<RestResponseDTO<?>> logout(@RequestHeader("X-Refresh-Token") String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                       HttpStatus.NO_CONTENT.value(),
                                                       "Logout successful",
                                                       null));
    }
}
