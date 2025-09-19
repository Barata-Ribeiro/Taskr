package com.barataribeiro.taskr.features.notification.events;

import com.barataribeiro.taskr.features.user.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ProjectMembershipNotificationEvent extends ApplicationEvent {
    private final User recipient;
    private final String projectTitle;
    private final String message;
    private final String username;

    public ProjectMembershipNotificationEvent(Object source, User recipient, String projectTitle, String message,
                                              String username) {
        super(source);
        this.recipient = recipient;
        this.projectTitle = projectTitle;
        this.message = message;
        this.username = username;
    }
}
