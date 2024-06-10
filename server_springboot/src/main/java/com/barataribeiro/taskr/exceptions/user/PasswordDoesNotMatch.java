package com.barataribeiro.taskr.exceptions.user;

public class PasswordDoesNotMatch extends RuntimeException {
    public PasswordDoesNotMatch() {
        super("Password does not match.");
    }
}
