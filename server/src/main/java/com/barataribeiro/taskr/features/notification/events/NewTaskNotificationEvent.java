package com.barataribeiro.taskr.features.notification.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class NewTaskNotificationEvent extends ApplicationEvent {
    private final Long projectId;
    private final String projectTitle;
    private final String taskTitle;
    private final String username;

    public NewTaskNotificationEvent(Object source, Long projectId, String projectTitle, String username,
                                    String taskTitle) {
        super(source);

        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.username = username;
        this.taskTitle = taskTitle;
    }
}
