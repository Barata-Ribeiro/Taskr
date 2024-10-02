package com.barataribeiro.taskr.services;

import com.barataribeiro.taskr.dtos.notification.NotificationDTO;

public interface NotificationService {
    void sendNotificationThroughWebsocket(String userId, NotificationDTO notificationDTO);
}
