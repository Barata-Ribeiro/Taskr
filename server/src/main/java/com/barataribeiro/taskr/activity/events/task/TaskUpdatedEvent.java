package com.barataribeiro.taskr.activity.events.task;

import com.barataribeiro.taskr.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskUpdatedEvent extends ApplicationEvent {
    private final Project project;
    private final String taskTitle;
    private final String username;
    private final String reason;

    public TaskUpdatedEvent(Object source, String taskTitle, Project project, String username, String reason) {
        super(source);
        this.project = project;
        this.taskTitle = taskTitle;
        this.username = username;
        this.reason = reason;
    }
}
