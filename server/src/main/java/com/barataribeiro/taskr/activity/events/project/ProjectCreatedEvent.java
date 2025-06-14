package com.barataribeiro.taskr.activity.events.project;

import com.barataribeiro.taskr.project.Project;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectCreatedEvent implements Serializable {
    private final Project project;
    private final String username;
}
