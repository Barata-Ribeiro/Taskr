package com.barataribeiro.taskr.authentication;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
