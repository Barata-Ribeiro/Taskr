package com.barataribeiro.taskr.exceptions.user;

public class UserIsNotInProject extends RuntimeException {
    public UserIsNotInProject() {
        super("User is not a member of the project.");
    }
}
