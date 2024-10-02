package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.notification.NotificationDTO;

import java.security.Principal;
import java.util.List;

public interface NotificationService {
    void sendNotificationThroughWebsocket(String userId, NotificationDTO notificationDTO);

    List<NotificationDTO> getLatestUserNotifications(Principal principal);
}
