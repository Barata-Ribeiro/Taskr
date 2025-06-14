package com.barataribeiro.taskr.activity.events.task;

import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.task.Task;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskCreatedEvent {
    private final Project project;
    private final Task task;
    private final String username;
}
