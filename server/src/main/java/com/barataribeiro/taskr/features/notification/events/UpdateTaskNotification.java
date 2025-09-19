package com.barataribeiro.taskr.features.notification.events;

import com.barataribeiro.taskr.features.user.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UpdateTaskNotification extends ApplicationEvent {
    private final User recipient;
    private final String taskTitle;
    private final String projectTitle;
    private final String username;

    public UpdateTaskNotification(Object source, User recipient, String taskTitle, String projectTitle,
                                  String username) {
        super(source);
        this.recipient = recipient;
        this.taskTitle = taskTitle;
        this.projectTitle = projectTitle;
        this.username = username;
    }
}
