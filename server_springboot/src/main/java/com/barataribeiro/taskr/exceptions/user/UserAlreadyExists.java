package com.barataribeiro.taskr.exceptions.user;

public class UserAlreadyExists extends RuntimeException {
    public UserAlreadyExists() {
        super("User already exists.");
    }
}
