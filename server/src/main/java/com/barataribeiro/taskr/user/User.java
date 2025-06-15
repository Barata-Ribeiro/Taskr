package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.comment.Comment;
import com.barataribeiro.taskr.membership.Membership;
import com.barataribeiro.taskr.notification.Notification;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.task.Task;
import com.barataribeiro.taskr.user.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_users", indexes = {
        @Index(name = "idx_user_id_username_email", columnList = "id, username, email"),
        @Index(name = "idx_user_username_email_unq", columnList = "username, email", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_user_username_email", columnNames = {"username", "email"})
})
public class User implements UserDetails, Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false, unique = true)
    private UUID id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @ToString.Exclude
    @Column(name = "password", nullable = false)
    private String password;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roles role = Roles.USER;

    // Profile Fields

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    // Settings

    @Builder.Default
    @Column(name = "is_private", columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private Boolean isPrivate = false;

    @Builder.Default
    @Column(name = "is_verified", columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private Boolean isVerified = false;

    // Timestamps

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    // Relations

    @Builder.Default
    @OneToMany(mappedBy = "owner", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private Set<Project> projects = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private Set<Membership> memberships = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "assignees")
    @ToString.Exclude
    @JsonIgnore
    private Set<Task> assignedTasks = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private Set<Comment> comments = new HashSet<>();

    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Notification> notifications = new LinkedHashSet<>();


    // UserDetails methods

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
    public boolean isEnabled() {
        return this.role != Roles.BANNED;
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(getId())
                .append(getUsername())
                .append(getEmail())
                .append(getRole())
                .append(getDisplayName())
                .append(getIsPrivate())
                .append(getIsVerified())
                .toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof User user)) return false;

        return new EqualsBuilder()
                .append(getId(), user.getId())
                .append(getUsername(), user.getUsername())
                .append(getEmail(), user.getEmail())
                .append(getRole(), user.getRole())
                .append(getDisplayName(), user.getDisplayName())
                .append(getIsPrivate(), user.getIsPrivate())
                .append(getIsVerified(), user.getIsVerified())
                .isEquals();
    }
}
