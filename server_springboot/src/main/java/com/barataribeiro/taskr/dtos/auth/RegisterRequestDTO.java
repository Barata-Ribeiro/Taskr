package com.barataribeiro.taskr.dtos.auth;

import jakarta.validation.constraints.*;

import java.io.Serializable;

public record RegisterRequestDTO(@NotNull
                                 @NotEmpty(message = "Username is required")
                                 @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters") String username,

                                 @Size(min = 3, max = 50, message = "Display name must be between 3 and 50 characters") String displayName,

                                 @NotNull
                                 @NotEmpty(message = "Email is required")
                                 @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
                                         message = "You must provide a valid email address.") String email,

                                 @NotNull
                                 @NotEmpty(message = "Password is required")
                                 @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
                                 @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
                                         message = "Password must contain at least one digit, " +
                                                 "one lowercase letter, one uppercase letter, " +
                                                 "one special character and no whitespace.") String password
) implements Serializable {
}
