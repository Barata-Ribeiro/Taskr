package com.barataribeiro.taskr.exceptions.organization;

public class OrganizationAlreadyExists extends RuntimeException {
    public OrganizationAlreadyExists() {
        super("An organization with this name already exists.");
    }
}
