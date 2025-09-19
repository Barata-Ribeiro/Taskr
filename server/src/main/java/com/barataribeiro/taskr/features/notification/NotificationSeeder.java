package com.barataribeiro.taskr.features.notification;

import com.barataribeiro.taskr.features.notification.enums.NotificationType;
import com.barataribeiro.taskr.features.user.User;
import com.barataribeiro.taskr.features.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@Profile("development")
@RequiredArgsConstructor
public class NotificationSeeder {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Value("${api.security.admin.username}")
    private String adminUsername;

    @PostConstruct
    @Transactional
    public void seedNotifications() {
        Optional<User> userOpt = userRepository.findByUsername(adminUsername);
        if (userOpt.isEmpty()) {
            log.atError().log("Admin user not found: {}", adminUsername);
            return;
        }

        User admin = userOpt.get();

        long existingCount = notificationRepository.countByRecipient_Id(admin.getId());
        if (existingCount > 0) {
            log.atInfo().log("Notifications already seeded for user: {}", adminUsername);
            return;
        }

        List<Notification> notifications = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Notification notification = Notification.builder()
                                                    .title("Test Notification " + i)
                                                    .message("This is test notification number " + i)
                                                    .type(NotificationType.INFO)
                                                    .recipient(admin)
                                                    .isRead(false)
                                                    .build();
            notifications.add(notification);
        }
        notificationRepository.saveAll(notifications);
        log.atInfo().log("Seeded notifications for user: {}", adminUsername);
    }
}
