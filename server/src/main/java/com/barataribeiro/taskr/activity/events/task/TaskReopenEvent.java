package com.barataribeiro.taskr.activity.events.task;

import com.barataribeiro.taskr.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskReopenEvent extends ApplicationEvent {
    private final Project project;
    private final String taskTitle;
    private final String username;

    public TaskReopenEvent(Object source, Project project, String taskTitle, String username) {
        super(source);
        this.project = project;
        this.taskTitle = taskTitle;
        this.username = username;
    }
}
