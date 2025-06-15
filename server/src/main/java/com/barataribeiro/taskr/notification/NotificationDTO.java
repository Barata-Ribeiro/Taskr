package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.notification.enums.NotificationType;
import com.barataribeiro.taskr.user.dtos.UserAuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link Notification}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationDTO implements Serializable {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private UserAuthorDTO recipient;
    private boolean isRead;
    private Instant createdAt;
    private Instant updatedAt;
}