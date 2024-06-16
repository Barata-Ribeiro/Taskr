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
    @NotNull
    @NotEmpty(message = "Username is required")
    @Size(min = 3, max = 50,
            message = "Username must be between 3 and 50 characters")
    private String username;

    @Size(min = 3, max = 50,
            message = "Display name must be between 3 and 50 characters")
    private String displayName;

    private String avatarUrl;

    @Column(nullable = false, unique = true)
    @NotNull
    @NotEmpty(message = "Email is required")
    @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
            message = "You must provide a valid email address.")
    private String email;

    @Column(nullable = false)
    @NotNull
    @NotEmpty(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
            message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace.")
    private String password;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Roles role = Roles.SERVICE_USER;

    @Builder.Default
    @Max(value = 15, message = "An user can manage up to 15 projects")
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
