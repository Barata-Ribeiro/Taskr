package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.NotificationMapper;
import com.barataribeiro.taskr.dtos.notification.NotificationDTO;
import com.barataribeiro.taskr.models.entities.Notification;
import com.barataribeiro.taskr.repositories.entities.NotificationRepository;
import com.barataribeiro.taskr.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public void sendNotificationThroughWebsocket(String username, NotificationDTO notificationDTO) {
        log.atInfo().log("Sending WS notification to user {}, with payload {}", username, notificationDTO);
        messagingTemplate.convertAndSendToUser(username, "/notifications", notificationDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getLatestUserNotifications(@NotNull Principal principal) {
        List<Notification> notifications = notificationRepository
                .findTop5ByUser_UsernameOrderByIssuedAtDesc(principal.getName());
        return notificationMapper.toDTOList(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllUserNotifications(int page, int perPage, @NotNull String direction,
                                                         String orderBy,
                                                         @NotNull Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase("issuedAt") ? "issuedAt" : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Notification> notifications = notificationRepository.findByUser_Username(principal.getName(), pageable);

        return notifications.map(notificationMapper::toDTO);
    }
}
