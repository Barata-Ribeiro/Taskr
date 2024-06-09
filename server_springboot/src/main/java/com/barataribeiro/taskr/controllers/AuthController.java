package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.auth.LoginRequestDTO;
import com.barataribeiro.taskr.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<RestResponseDTO> login(@RequestBody LoginRequestDTO body) {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK, HttpStatus.OK.value(), "Login successful", null));
    }

    @PostMapping("/register")
    public ResponseEntity<RestResponseDTO> register() {

        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK, HttpStatus.OK.value(), "Login successful", null));
    }
}
