package com.barataribeiro.taskr.notification.dtos;

import com.barataribeiro.taskr.notification.Notification;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link Notification}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LatestNotificationsDTO implements Serializable {
    private List<NotificationDTO> latestNotifications;
    private Long totalCount;
    private Long totalRead;
    private Long totalUnread;
}