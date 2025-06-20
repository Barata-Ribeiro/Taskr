package com.barataribeiro.taskr.notification.events;

import com.barataribeiro.taskr.user.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskMembershipNotificationEvent extends ApplicationEvent {
    private final User recipient;
    private final String taskTitle;
    private final String message;
    private final String username;

    public TaskMembershipNotificationEvent(Object source, User recipient, String taskTitle, String message,
                                           String username) {
        super(source);
        this.recipient = recipient;
        this.taskTitle = taskTitle;
        this.message = message;
        this.username = username;
    }
}
