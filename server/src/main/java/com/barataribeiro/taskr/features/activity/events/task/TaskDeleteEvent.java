package com.barataribeiro.taskr.features.activity.events.task;

import com.barataribeiro.taskr.features.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskDeleteEvent extends ApplicationEvent {
    private final Project project;
    private final Long taskId;
    private final String username;

    public TaskDeleteEvent(Object source, Project project, Long taskId, String username) {
        super(source);
        this.project = project;
        this.taskId = taskId;
        this.username = username;
    }
}
