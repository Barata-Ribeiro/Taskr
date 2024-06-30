package com.barataribeiro.taskr.exceptions.user;

public class UserIsBanned extends RuntimeException {
    public UserIsBanned() {
        super("User is banned.");
    }
}
