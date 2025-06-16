package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.membership.Membership;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.notification.dtos.NotificationDTO;
import com.barataribeiro.taskr.notification.events.NewTaskNotificationEvent;
import com.barataribeiro.taskr.user.User;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.util.Streamable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationEventListener {
    private final NotificationRepository notificationRepository;
    private final MembershipRepository membershipRepository;
    private final NotificationService notificationService;
    private final NotificationBuilder notificationBuilder;

    @EventListener
    public void onNewTaskNotificationEvent(@NotNull NewTaskNotificationEvent event) {
        Streamable<Membership> memberships = membershipRepository.findByProject_Id(event.getProjectId());
        memberships.stream().parallel().filter(
                           membership -> !membership.getUser().getUsername().equals(event.getUsername()))
                   .forEach(membership -> {
                       User user = membership.getUser();
                       final String message = String
                               .format("A new task '%s' has been created in project '%s' by %s.",
                                       event.getTaskTitle(), event.getProjectTitle(), event.getUsername());

                       Notification notification = Notification.builder()
                                                               .title("New Task Created")
                                                               .message(message)
                                                               .recipient(user)
                                                               .build();

                       Notification savedNotification = notificationRepository.save(notification);
                       NotificationDTO notificationDTO = notificationBuilder.toNotificationDTO(savedNotification);

                       notificationService.sendNotificationThroughWebsocket(user.getUsername(), notificationDTO);
                   });
    }
}
