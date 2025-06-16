package com.barataribeiro.taskr.activity.events.project;

import com.barataribeiro.taskr.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ProjectUpdateEvent extends ApplicationEvent {
    private final Project project;
    private final String username;
    private final String reason;

    public ProjectUpdateEvent(Object source, Project project, String username, String reason) {
        super(source);
        this.project = project;
        this.username = username;
        this.reason = reason;
    }
}
