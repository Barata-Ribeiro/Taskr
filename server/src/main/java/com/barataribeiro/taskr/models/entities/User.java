package com.barataribeiro.taskr.models.entities;

import com.barataribeiro.taskr.models.enums.Roles;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "taskr_users", indexes = {
        @Index(name = "idx_user_username_email_unq", columnList = "username, email", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_user_username_email", columnNames = {"username", "email"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true)
    @NotNull(message = "Username is required.")
    @NotEmpty(message = "Username must not be empty.")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-z]*$", message = "Username must contain only lowercase letters.")
    private String username;

    @Size(min = 3, max = 50, message = "Display name must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-zA-Z ]*$", message = "Display name must contain only letters, and spaces.")
    private String displayName;

    private String firstName;

    private String lastName;

    @Pattern(regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)", message = "You must provide a valid URL.")
    private String avatarUrl;

    @Column(nullable = false, unique = true)
    @NotNull(message = "Email is required")
    @NotEmpty(message = "Email must not be empty")
    @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}", message = "You must provide a valid email address.")
    private String email;

    @Column(nullable = false)
    @NotNull(message = "Password is required.")
    @NotEmpty(message = "Password must not be empty.")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters.")
    @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace.")
    private String password;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Roles role = Roles.SERVICE_USER;

    @Builder.Default
    @Max(value = 15, message = "An user can manage up to 15 projects.")
    @Column(columnDefinition = "integer default 0", nullable = false)
    private int managedProjects = 0;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public void incrementManagedProjects() {
        this.managedProjects++;
    }

    public void decrementManagedProjects() {
        this.managedProjects = this.managedProjects > 0 ? this.managedProjects - 1 : 0;
    }
}
