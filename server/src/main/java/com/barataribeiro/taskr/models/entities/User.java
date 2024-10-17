package com.barataribeiro.taskr.models.entities;

import com.barataribeiro.taskr.models.enums.Roles;
import com.barataribeiro.taskr.models.relations.OrganizationUser;
import com.barataribeiro.taskr.models.relations.ProjectUser;
import com.barataribeiro.taskr.models.relations.TaskUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "taskr_users", uniqueConstraints = {
        @UniqueConstraint(name = "uc_user_username_email", columnNames = {"username", "email"})
})
public class User implements UserDetails, Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @NotBlank(message = "Username is required.")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-z]*$", message = "Username must contain only lowercase letters.")
    @Column(nullable = false, unique = true)
    private String username;

    @Size(min = 3, max = 50, message = "Display name must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-zA-Z ]*$", message = "Display name must contain only letters, and spaces.")
    private String displayName;

    @JsonIgnore
    @ToString.Exclude
    private String firstName;

    @JsonIgnore
    @ToString.Exclude
    private String lastName;

    private String fullName;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String avatarUrl;

    @NotBlank(message = "Email is required.")
    @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
           message = "You must provide a valid email address.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters.")
    @Pattern(
            message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, one " +
                    "special character and no whitespace.",
            regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$")
    @ToString.Exclude
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Roles role = Roles.SERVICE_USER;

    @Builder.Default
    @Max(value = 15, message = "An user can manage up to 15 projects.")
    @Column(columnDefinition = "integer default 0", nullable = false)
    private int managedProjects = 0;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long totalNotifications = 0L;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long totalReadNotifications = 0L;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long totalUnreadNotifications = 0L;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    // Associations
    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Notification> notifications = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<OrganizationUser> organizationUsers = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<ProjectUser> projectUser = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<TaskUser> taskUser = new LinkedHashSet<>();

    // Lifecycle methods
    @PostLoad
    @PostPersist
    @PostUpdate
    public void lifeCycleActions() {
        this.totalNotifications = (long) this.notifications.size();
        this.totalReadNotifications = this.notifications.stream().filter(Notification::isRead).count();
        this.totalUnreadNotifications = this.totalNotifications - this.totalReadNotifications;

        this.fullName = this.firstName + " " + this.lastName;

        this.managedProjects = (int) this.projectUser.stream().filter(ProjectUser::isProjectManager).count();
    }

    public void incrementManagedProjects() {
        this.managedProjects++;
    }

    public void decrementManagedProjects() {
        this.managedProjects = this.managedProjects > 0 ? this.managedProjects - 1 : 0;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return this.role != Roles.BANNED;
    }
}
