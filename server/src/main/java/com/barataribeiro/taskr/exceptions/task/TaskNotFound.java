package com.barataribeiro.taskr.exceptions.task;

public class TaskNotFound extends RuntimeException {
    public TaskNotFound() {
        super("Task not found.");
    }
}
