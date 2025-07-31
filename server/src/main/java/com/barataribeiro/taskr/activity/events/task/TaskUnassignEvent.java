package com.barataribeiro.taskr.activity.events.task;

import com.barataribeiro.taskr.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskUnassignEvent extends ApplicationEvent {
    private final Project project;
    private final String taskTitle;
    private final String userDisplayName;
    private final String username;

    public TaskUnassignEvent(Object source, Project project, String taskTitle, String userDisplayName,
                             String username) {
        super(source);
        this.project = project;
        this.taskTitle = taskTitle;
        this.userDisplayName = userDisplayName;
        this.username = username;
    }
}
