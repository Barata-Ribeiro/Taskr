package com.barataribeiro.taskr.features.notification;

import com.barataribeiro.taskr.features.membership.Membership;
import com.barataribeiro.taskr.features.membership.MembershipRepository;
import com.barataribeiro.taskr.features.notification.dtos.NotificationDTO;
import com.barataribeiro.taskr.features.notification.events.*;
import com.barataribeiro.taskr.features.user.User;
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
    public void onProjectMembershipNotificationEvent(@NotNull ProjectMembershipNotificationEvent event) {
        User recipient = event.getRecipient();
        String message = event.getMessage();

        Notification notification = Notification.builder()
                                                .title("Project Membership Update!")
                                                .message(message)
                                                .recipient(recipient)
                                                .build();

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDTO notificationDTO = notificationBuilder.toNotificationDTO(savedNotification);

        notificationService.sendNotificationThroughWebsocket(recipient.getUsername(), notificationDTO);
    }

    @EventListener
    public void onNewTaskNotificationEvent(@NotNull NewTaskNotificationEvent event) {
        Streamable<Membership> memberships = membershipRepository.findByProject_Id(event.getProjectId());
        memberships.stream().parallel()
                   .filter(membership -> !membership.getUser().getUsername().equals(event.getUsername()))
                   .forEach(membership -> {
                       User user = membership.getUser();
                       final String message = String
                               .format("A new task '%s' has been created in project '%s' by %s.",
                                       event.getTaskTitle(), event.getProjectTitle(), event.getUsername());

                       Notification notification = Notification.builder()
                                                               .title("New Task Created!")
                                                               .message(message)
                                                               .recipient(user)
                                                               .build();

                       Notification savedNotification = notificationRepository.save(notification);
                       NotificationDTO notificationDTO = notificationBuilder.toNotificationDTO(savedNotification);

                       notificationService.sendNotificationThroughWebsocket(user.getUsername(), notificationDTO);
                   });
    }

    @EventListener
    public void onUpdateTaskNotificationEvent(@NotNull UpdateTaskNotification event) {
        User recipient = event.getRecipient();
        String message = String.format("The task '%s' in project '%s' has been updated by %s.",
                                       event.getTaskTitle(), event.getProjectTitle(), event.getUsername());

        Notification notification = Notification.builder()
                                                .title("Task Updated!")
                                                .message(message)
                                                .recipient(recipient)
                                                .build();

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDTO notificationDTO = notificationBuilder.toNotificationDTO(savedNotification);

        notificationService.sendNotificationThroughWebsocket(recipient.getUsername(), notificationDTO);
    }

    @EventListener
    public void onTaskMembershipNotificationEvent(@NotNull TaskMembershipNotificationEvent event) {
        User recipient = event.getRecipient();
        String message = event.getMessage();

        Notification notification = Notification.builder()
                                                .title("Task Membership Update!")
                                                .message(message)
                                                .recipient(recipient)
                                                .build();

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDTO notificationDTO = notificationBuilder.toNotificationDTO(savedNotification);

        notificationService.sendNotificationThroughWebsocket(recipient.getUsername(), notificationDTO);
    }

    @EventListener
    public void onNewCommentNotificationEvent(@NotNull NewCommentNotificationEvent event) {
        User recipient = event.getRecipient();
        String message = String.format("'%s' commented on the task '%s'", event.getUsername(), event.getTaskTitle());

        Notification notification = Notification.builder()
                                                .title("New Comment Added!")
                                                .message(message)
                                                .recipient(recipient)
                                                .build();

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDTO notificationDTO = notificationBuilder.toNotificationDTO(savedNotification);

        notificationService.sendNotificationThroughWebsocket(recipient.getUsername(), notificationDTO);
    }
}
