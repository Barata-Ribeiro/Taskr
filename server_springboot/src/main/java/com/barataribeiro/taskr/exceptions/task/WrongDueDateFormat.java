package com.barataribeiro.taskr.exceptions.task;

public class WrongDueDateFormat extends RuntimeException {
    public WrongDueDateFormat() {
        super("Due date must be in the format dd-MM-yyyy.");
    }
}
