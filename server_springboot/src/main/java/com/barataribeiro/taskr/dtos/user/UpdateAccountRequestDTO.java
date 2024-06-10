package com.barataribeiro.taskr.dtos.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateAccountRequestDTO(
        @Size(min = 3, max = 50,
                message = "Username must be between 3 and 50 characters") String username,

        @Size(min = 3, max = 50,
                message = "Display name must be between 3 and 50 characters") String displayName,

        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
                message = "Password must contain at least one digit, " +
                        "one lowercase letter, one uppercase letter, " +
                        "one special character and no whitespace.") String newPassword,

        @NotNull @NotEmpty(message = "You must provide your current password.") String currentPassword) {
}
