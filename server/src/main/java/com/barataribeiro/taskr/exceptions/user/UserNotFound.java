package com.barataribeiro.taskr.exceptions.user;

public class UserNotFound extends RuntimeException {
    public UserNotFound() {
        super("User not found.");
    }
}
