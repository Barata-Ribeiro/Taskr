package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.features.user.User;
import com.barataribeiro.taskr.features.user.enums.Roles;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    @DisplayName("User is enabled when not banned")
    void isEnabledReturnsTrueForNonBannedUser() {
        User user = User.builder()
                        .username("user1")
                        .email("user1@example.com")
                        .password("password")
                        .role(Roles.USER)
                        .displayName("User One")
                        .build();

        assertTrue(user.isEnabled());
    }

    @Test
    @DisplayName("User is not enabled when banned")
    void isEnabledReturnsFalseForBannedUser() {
        User user = User.builder()
                        .username("banneduser")
                        .email("banned@example.com")
                        .password("password")
                        .role(Roles.BANNED)
                        .displayName("Banned User")
                        .build();

        assertFalse(user.isEnabled());
    }

    @Test
    @DisplayName("User authorities contain correct role")
    void getAuthoritiesReturnsCorrectRole() {
        User user = User.builder()
                        .username("admin")
                        .email("admin@example.com")
                        .password("password")
                        .role(Roles.ADMIN)
                        .displayName("Admin User")
                        .build();

        assertEquals(1, user.getAuthorities().size());
        GrantedAuthority authority = user.getAuthorities().iterator().next();
        assertEquals("ROLE_ADMIN", authority.getAuthority());
    }

    @Test
    @DisplayName("User default values are set")
    void builderSetsDefaultValues() {
        User user = User.builder()
                        .username("defaultuser")
                        .email("default@example.com")
                        .password("password")
                        .displayName("Default User")
                        .build();

        assertEquals(Roles.USER, user.getRole());
        assertFalse(user.getIsPrivate());
        assertFalse(user.getIsVerified());
        assertNotNull(user.getProjects());
        assertNotNull(user.getMemberships());
        assertNotNull(user.getAssignedTasks());
        assertNotNull(user.getComments());
        assertNotNull(user.getNotifications());
    }

    @Test
    @DisplayName("User can set and get all fields")
    void canSetAndGetAllFields() {
        UUID id = UUID.randomUUID();
        Instant now = Instant.now();

        User user = User.builder()
                        .id(id)
                        .username("fulluser")
                        .email("full@example.com")
                        .password("password")
                        .role(Roles.ADMIN)
                        .displayName("Full User")
                        .fullName("Full Name")
                        .avatarUrl("http://avatar.url")
                        .isPrivate(true)
                        .isVerified(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .projects(Set.of())
                        .memberships(Set.of())
                        .assignedTasks(Set.of())
                        .comments(Set.of())
                        .notifications(Set.of())
                        .build();

        assertEquals(id, user.getId());
        assertEquals("fulluser", user.getUsername());
        assertEquals("full@example.com", user.getEmail());
        assertEquals("password", user.getPassword());
        assertEquals(Roles.ADMIN, user.getRole());
        assertEquals("Full User", user.getDisplayName());
        assertEquals("Full Name", user.getFullName());
        assertEquals("http://avatar.url", user.getAvatarUrl());
        assertTrue(user.getIsPrivate());
        assertTrue(user.getIsVerified());
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
        assertNotNull(user.getProjects());
        assertNotNull(user.getMemberships());
        assertNotNull(user.getAssignedTasks());
        assertNotNull(user.getComments());
        assertNotNull(user.getNotifications());
    }
}