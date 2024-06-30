package com.barataribeiro.taskr.exceptions.organization;

public class UserIsNotOwner extends RuntimeException {
    public UserIsNotOwner() {
        super("You are not the owner of this organization.");
    }
}
