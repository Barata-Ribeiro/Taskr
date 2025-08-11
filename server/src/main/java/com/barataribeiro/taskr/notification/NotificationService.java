package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.notification.dtos.LatestNotificationsDTO;
import com.barataribeiro.taskr.notification.dtos.NotificationDTO;
import com.barataribeiro.taskr.notification.dtos.TotalNotifications;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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

    @Cacheable(value = "notifications", key = "#authentication.name")
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllNotifications(@NotNull PageQueryParamsDTO pageQueryParams,
                                                     @NotNull Authentication authentication) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());

        return notificationRepository.findAllByRecipient_Username(authentication.getName(), pageable)
                                     .map(notificationBuilder::toNotificationDTO);
    }

    @Cacheable(value = "notification", key = "#notifId + '_' + #authentication.name")
    @Transactional(readOnly = true)
    public NotificationDTO getNotificationById(Long notifId, @NotNull Authentication authentication) {
        Notification notification = notificationRepository
                .findByIdAndRecipient_Username(notifId, authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException(Notification.class.getSimpleName()));
        return notificationBuilder.toNotificationDTO(notification);
    }

    @Caching(evict = {@CacheEvict(value = "notifications", key = "#authentication.name"),},
             put = @CachePut(value = "notification", key = "#notifId + '_' + #authentication.name"))
    @Transactional
    public NotificationDTO changeNotificationStatus(Long notifId, Boolean isRead,
                                                    @NotNull Authentication authentication) {
        Notification notification = notificationRepository
                .findByIdAndRecipient_Username(notifId, authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException(Notification.class.getSimpleName()));

        notification.setRead(isRead);

        return notificationBuilder.toNotificationDTO(notificationRepository.save(notification));
    }

    @Caching(evict = {
            @CacheEvict(value = "notification", allEntries = true),
            @CacheEvict(value = "notifications", key = "#authentication.name", allEntries = true),
    },
             put = @CachePut(value = "notifications", key = "#authentication.name"))
    @Transactional
    public List<NotificationDTO> changeNotificationsStatusInBulk(@NotNull List<Long> notifIds, Boolean isRead,
                                                                 Authentication authentication) {
        if (notifIds.isEmpty()) throw new IllegalRequestException("No notification IDs were provided");
        List<Notification> notifications = notificationRepository
                .findDistinctByIdInAndRecipient_Username(notifIds, authentication.getName());

        if (notifications.isEmpty()) throw new EntityNotFoundException(Notification.class.getSimpleName());

        notifications.parallelStream().forEach(notification -> notification.setRead(isRead));

        return notificationBuilder.toNotificationDTOList(notificationRepository.saveAll(notifications));
    }

    @Caching(evict = {@CacheEvict(value = "notification", key = "#notifId + '_' + #authentication.name"),
                      @CacheEvict(value = "notifications", key = "#authentication.name"),})
    @Transactional
    public void deleteNotification(Long notifId, @NotNull Authentication authentication) {
        long wasDeleted = notificationRepository
                .deleteByIdAndRecipient_Username(notifId, authentication.getName());
        if (wasDeleted == 0) throw new IllegalRequestException("Notification not found or you are not the recipient");
    }

    @Caching(evict = {@CacheEvict(value = "notifications", key = "#authentication.name"),
                      @CacheEvict(value = "notification", allEntries = true),})
    @Transactional
    public void deleteNotificationsInBulk(@NotNull List<Long> notifIds, Authentication authentication) {
        if (notifIds.isEmpty()) throw new IllegalRequestException("No notification IDs were provided");

        long deletedCount = notificationRepository.deleteByIdInAndRecipient_Username(notifIds,
                                                                                     authentication.getName());
        if (deletedCount != notifIds.size()) {
            throw new IllegalRequestException("Some notifications were not found or you are not the recipient");
        }
    }

    private @NotNull PageRequest getPageRequest(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        return PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));
    }
}
