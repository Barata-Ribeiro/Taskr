package com.barataribeiro.taskr.exceptions.organization;

public class AlreadyCreatedOrganization extends RuntimeException {
    public AlreadyCreatedOrganization() {
        super("You already have an organization created.");
    }
}
