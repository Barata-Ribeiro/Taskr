package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.user.UpdateAccountRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.barataribeiro.taskr.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    private final UserService userService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<RestResponseDTO<UserDTO>> getUserProfileById(@PathVariable String userId) {
        UserDTO response = userService.getUserProfileById(userId);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User profile retrieved successfully",
                                                       response));
    }

    @GetMapping("/me/context")
    public ResponseEntity<RestResponseDTO<UserDTO>> getUserContext(Principal principal) {
        UserDTO response = userService.getUserContext(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User context retrieved successfully",
                                                       response));
    }

    @PutMapping("/me/{userId}")
    public ResponseEntity<RestResponseDTO<UserDTO>> updateUserProfile(@PathVariable String userId,
                                                                      @RequestBody UpdateAccountRequestDTO body,
                                                                      Principal principal) {
        UserDTO response = userService.updateUserProfile(userId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User profile updated successfully",
                                                       response));
    }

    @DeleteMapping("/me/{userId}")
    public ResponseEntity<RestResponseDTO<?>> deleteUserProfile(@PathVariable String userId, Principal principal) {
        userService.deleteUserProfile(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User profile deleted successfully",
                                                       null));
    }
}
