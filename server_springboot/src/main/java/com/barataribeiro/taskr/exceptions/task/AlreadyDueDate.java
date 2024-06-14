package com.barataribeiro.taskr.exceptions.task;

public class AlreadyDueDate extends RuntimeException {
    public AlreadyDueDate() {
        super("Task is already due. Must be in the future.");
    }
}
