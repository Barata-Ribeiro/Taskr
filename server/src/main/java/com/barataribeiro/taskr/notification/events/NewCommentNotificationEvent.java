package com.barataribeiro.taskr.notification.events;

import com.barataribeiro.taskr.user.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class NewCommentNotificationEvent extends ApplicationEvent {
    private final User recipient;
    private final String taskTitle;
    private final String username;

    public NewCommentNotificationEvent(Object source, User recipient, String taskTitle, String username) {
        super(source);
        this.recipient = recipient;
        this.taskTitle = taskTitle;
        this.username = username;
    }
}
