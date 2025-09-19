package com.barataribeiro.taskr.features.notification;

import com.barataribeiro.taskr.features.notification.enums.NotificationType;
import com.barataribeiro.taskr.features.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class NotificationTest {

    @Test
    @DisplayName("Notification builder sets all fields correctly")
    void builderSetsAllFieldsCorrectly() {
        User recipient = User.builder().username("notify").build();
        Instant now = Instant.now();

        Notification notification = Notification.builder()
                                                .id(1L)
                                                .title("Title")
                                                .message("Message")
                                                .type(NotificationType.WARNING)
                                                .recipient(recipient)
                                                .isRead(true)
                                                .createdAt(now)
                                                .updatedAt(now)
                                                .build();

        assertEquals(1L, notification.getId());
        assertEquals("Title", notification.getTitle());
        assertEquals("Message", notification.getMessage());
        assertEquals(NotificationType.WARNING, notification.getType());
        assertEquals(recipient, notification.getRecipient());
        assertTrue(notification.isRead());
        assertEquals(now, notification.getCreatedAt());
        assertEquals(now, notification.getUpdatedAt());
    }

    @Test
    @DisplayName("Notification default type is INFO and isRead is false")
    void defaultTypeIsInfoAndIsReadIsFalse() {
        Notification notification = Notification.builder().build();
        assertEquals(NotificationType.INFO, notification.getType());
        assertFalse(notification.isRead());
    }
}