package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.user.dtos.UserAccountDTO;
import com.barataribeiro.taskr.user.dtos.UserUpdateRequestDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Users", description = "Endpoints for managing users")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<RestResponse<UserAccountDTO>> getAccountDetails(Authentication authentication) {
        UserAccountDTO userAccountDTO = userService.getAccountDetails(authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Account details retrieved successfully", userAccountDTO));
    }

    @PatchMapping("/me")
    public ResponseEntity<RestResponse<UserAccountDTO>> updateAccountDetails(Authentication authentication,
                                                                             @RequestBody @Valid
                                                                             UserUpdateRequestDTO body) {
        UserAccountDTO updatedUser = userService.updateAccountDetails(authentication, body);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Account details updated successfully", updatedUser));
    }

    @DeleteMapping("/me")
    public ResponseEntity<RestResponse<Void>> deleteAccount(Authentication authentication) {
        userService.deleteAccount(authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                      "Account deleted successfully", null));
    }
}
