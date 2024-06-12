package com.barataribeiro.taskr.exceptions.user;

public class UserIsNotOrganizationMember extends RuntimeException {
    public UserIsNotOrganizationMember() {
        super("User is not a member of the organization.");
    }
}
