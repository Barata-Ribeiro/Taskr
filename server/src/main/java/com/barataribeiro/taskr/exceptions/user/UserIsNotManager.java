package com.barataribeiro.taskr.exceptions.user;

public class UserIsNotManager extends RuntimeException {
    public UserIsNotManager() {
        super("User is not the project's manager.");
    }
}
