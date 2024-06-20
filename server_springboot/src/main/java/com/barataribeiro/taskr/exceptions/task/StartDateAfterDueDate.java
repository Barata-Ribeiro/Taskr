package com.barataribeiro.taskr.exceptions.task;

public class StartDateAfterDueDate extends RuntimeException {
    public StartDateAfterDueDate() {
        super("Start date cannot be after due date.");
    }
}
