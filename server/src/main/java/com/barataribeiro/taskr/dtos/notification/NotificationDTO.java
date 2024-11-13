package com.barataribeiro.taskr.dtos.notification;

import com.barataribeiro.taskr.dtos.user.ContextDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.taskr.models.entities.Notification}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationDTO implements Serializable {
    private Long id;
    private String title;
    private String message;
    private boolean isRead;
    private Instant issuedAt;
    private Instant readAt;
    private ContextDTO user;
}