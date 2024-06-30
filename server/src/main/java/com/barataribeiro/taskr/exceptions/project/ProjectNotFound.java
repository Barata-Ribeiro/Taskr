package com.barataribeiro.taskr.exceptions.project;

public class ProjectNotFound extends RuntimeException {
    public ProjectNotFound() {
        super("Project not found.");
    }
}
