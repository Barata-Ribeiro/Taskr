package com.barataribeiro.taskr.exceptions.project;

public class ProjectAlreadyExists extends RuntimeException {
    public ProjectAlreadyExists() {
        super("An project with this name already exists.");
    }
}
