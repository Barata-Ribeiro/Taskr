package com.barataribeiro.taskr.exceptions.project;

public class ProjectLimitReached extends RuntimeException {
    public ProjectLimitReached() {
        super("You have reached the limit of projects allowed per user.");
    }
}
