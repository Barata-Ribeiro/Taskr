package com.barataribeiro.taskr.activity.events.task;

import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.task.Task;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskCreatedEvent extends ApplicationEvent {
    private final Project project;
    private final Task task;
    private final String username;

    public TaskCreatedEvent(Object source, Project project, Task task, String username) {
        super(source);
        this.project = project;
        this.task = task;
        this.username = username;
    }
}
