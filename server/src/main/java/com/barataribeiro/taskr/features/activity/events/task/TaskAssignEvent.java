package com.barataribeiro.taskr.features.activity.events.task;

import com.barataribeiro.taskr.features.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskAssignEvent extends ApplicationEvent {
    private final Project project;
    private final String taskTitle;
    private final String userDisplayName;
    private final String username;

    public TaskAssignEvent(Object source, Project project, String taskTitle, String userDisplayName, String username) {
        super(source);
        this.project = project;
        this.taskTitle = taskTitle;
        this.userDisplayName = userDisplayName;
        this.username = username;
    }
}
