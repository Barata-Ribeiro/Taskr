package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.user.ContextDTO;
import com.barataribeiro.taskr.dtos.user.UpdateAccountRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.barataribeiro.taskr.services.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Tag(name = "User", description = "User related operations")
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
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getUserContext(Principal principal) {
        Map<String, Object> response = userService.getUserContext(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User context retrieved successfully",
                                                       response));
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> getUserDashboard(Principal principal) {
        Map<String, Object> response = userService.getUserDashboard(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User dashboard retrieved successfully",
                                                       response));
    }

    @PatchMapping("/me/{userId}")
    public ResponseEntity<RestResponseDTO<ContextDTO>> updateUserProfile(@PathVariable String userId,
                                                                         @RequestParam(required = false) String ra,
                                                                         @RequestBody UpdateAccountRequestDTO body,
                                                                         Principal principal) {
        ContextDTO response = null;

        if (ra != null) response = userService.removeUserAvatar(userId, principal, ra);
        else response = userService.updateUserProfile(userId, body, principal);

        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User profile updated successfully",
                                                       response));
    }

    @DeleteMapping("/me/{userId}")
    public ResponseEntity<RestResponseDTO<Void>> deleteUserProfile(@PathVariable String userId, Principal principal) {
        userService.deleteUserProfile(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                       HttpStatus.NO_CONTENT.value(),
                                                       "User profile deleted successfully",
                                                       null));
    }
}
