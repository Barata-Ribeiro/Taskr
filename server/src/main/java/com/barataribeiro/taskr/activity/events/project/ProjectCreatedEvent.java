package com.barataribeiro.taskr.activity.events.project;

import com.barataribeiro.taskr.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ProjectCreatedEvent extends ApplicationEvent {
    private final Project project;
    private final String username;

    public ProjectCreatedEvent(Object source, Project project, String username) {
        super(source);
        this.project = project;
        this.username = username;
    }
}
