package com.barataribeiro.taskr.authentication;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.LoginResponseDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.authentication.services.AuthenticationService;
import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Authentication", description = "Endpoints for user authentication")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @Operation(summary = "Create a new user account",
               description = "Registers a new user with the provided username, email, and password.")
    @PostMapping("/register")
    public ResponseEntity<RestResponse<UserSecurityDTO>> createAccount(
            @RequestBody @Valid RegistrationRequestDTO body) {
        UserSecurityDTO response = authenticationService.createAccount(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new RestResponse<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                      "Account created successfully", response));
    }

    @Operation(summary = "Login user",
               description = "Logs in a user with the provided username or email and password.")
    @PostMapping("/login")
    public ResponseEntity<RestResponse<LoginResponseDTO>> loginUser(@RequestBody @Valid LoginRequestDTO body) {
        LoginResponseDTO response = authenticationService.loginUser(body);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Login successful", response));
    }

    @Operation(summary = "Refresh authentication token",
               description = "Refreshes the authentication token for the user.")
    @PostMapping("/refresh-token")
    public ResponseEntity<RestResponse<LoginResponseDTO>> refreshToken(@RequestHeader("X-Refresh-Token")
                                                                       String refreshToken) {
        LoginResponseDTO response = authenticationService.refreshToken(refreshToken);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Token refreshed successfully", response));
    }

    @Operation(summary = "Logout user",
               description = "Logs out the user by invalidating the current authentication token.")
    @DeleteMapping("/logout")
    public ResponseEntity<RestResponse<Void>> logoutUser(@RequestHeader("X-Refresh-Token")
                                                         String refreshToken) {
        authenticationService.logoutUser(refreshToken);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Logout successful", null));
    }
}
