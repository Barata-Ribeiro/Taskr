package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.dtos.notification.NotificationDTO;
import com.barataribeiro.taskr.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendNotificationThroughWebsocket(String username, NotificationDTO notificationDTO) {
        log.atInfo().log("Sending WS notification to user {}, with payload {}", username, notificationDTO);
        messagingTemplate.convertAndSendToUser(username, "/notifications", notificationDTO);
    }
}
