package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.notification.dtos.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotificationThroughWebsocket(String username, NotificationDTO notification) {
        messagingTemplate.convertAndSendToUser(username, "/notifications", notification);
    }
}
