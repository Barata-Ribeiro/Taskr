package com.barataribeiro.taskr.features.user.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserUpdateRequestDTO implements Serializable {
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-z]*$", message = "Username must contain only lowercase letters.")
    private String username;

    @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
           message = "You must provide a valid email address.")
    private String email;

    @Size(min = 0, max = 200, message = "Biography must be between 0 and 200 characters.")
    private String bio;

    @Size(min = 3, max = 50, message = "Display name must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-zA-Z ]*$", message = "Display name must contain only letters, and spaces.")
    private String displayName;

    @Pattern(regexp = "^[a-zA-Z ]*$", message = "Full name must contain only letters, and spaces.")
    private String fullName;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String avatarUrl;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String coverUrl;

    @Pattern(regexp = "^[a-zA-Z/ ]*$", message = "Pronouns may only contain letters, spaces, and slashes.")
    private String pronouns;

    @Size(min = 0, max = 100, message = "Location must be between 0 and 100 characters.")
    private String location;

    @Size(min = 0, max = 100, message = "Website must be between 0 and 100 characters.")
    @URL(message = "Invalid URL format.", protocol = "https", regexp = "^https://[A-Za-z0-9.-]+\\.[A-Za-z]{2,}.*$")
    private String website;

    @Size(min = 0, max = 100, message = "Company must be between 0 and 100 characters.")
    private String company;

    @Size(min = 0, max = 100, message = "Job title must be between 0 and 100 characters.")
    private String jobTitle;

    private String currentPassword;

    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters.")
    @Pattern(message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one " +
            "special character and no whitespace.",
             regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%¨^&*()\\-_=+])(?=\\S+$).{8,}$")
    private String newPassword;
}
