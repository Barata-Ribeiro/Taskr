package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.notification.dtos.LatestNotificationsDTO;
import com.barataribeiro.taskr.notification.dtos.NotificationDTO;
import com.barataribeiro.taskr.notification.dtos.TotalNotifications;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final NotificationBuilder notificationBuilder;

    public void sendNotificationThroughWebsocket(String username, NotificationDTO notification) {
        messagingTemplate.convertAndSendToUser(username, "/notifications", notification);
    }

    @Transactional(readOnly = true)
    public LatestNotificationsDTO getLatestNotification(@NotNull Authentication authentication) {
        TotalNotifications totalNotifications = notificationRepository.
                getNotificationCountsByRecipient_Username(authentication.getName());

        List<Notification> latestNotifications = notificationRepository
                .findTop5ByRecipient_UsernameOrderByCreatedAtDesc(authentication.getName());

        LatestNotificationsDTO latestNotificationsDTO = new LatestNotificationsDTO();
        latestNotificationsDTO.setLatestNotifications(notificationBuilder.toNotificationDTOList(latestNotifications));
        latestNotificationsDTO.setTotalCount(totalNotifications.totalCount());
        latestNotificationsDTO.setTotalRead(totalNotifications.totalRead());
        latestNotificationsDTO.setTotalUnread(totalNotifications.totalUnread());

        return latestNotificationsDTO;
    }

    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllNotifications(@NotNull PageQueryParamsDTO pageQueryParams,
                                                     @NotNull Authentication authentication) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());

        return notificationRepository.findAllByRecipient_Username(authentication.getName(), pageable)
                                     .map(notificationBuilder::toNotificationDTO);
    }

    private @NotNull PageRequest getPageRequest(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        return PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));
    }
}
