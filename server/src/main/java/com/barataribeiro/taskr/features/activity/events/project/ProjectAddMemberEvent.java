package com.barataribeiro.taskr.features.activity.events.project;

import com.barataribeiro.taskr.features.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ProjectAddMemberEvent extends ApplicationEvent {
    private final Project project;
    private final String username;
    private final String memberAdded;

    public ProjectAddMemberEvent(Object source, Project project, String username, String memberAdded) {
        super(source);
        this.project = project;
        this.username = username;
        this.memberAdded = memberAdded;
    }
}

