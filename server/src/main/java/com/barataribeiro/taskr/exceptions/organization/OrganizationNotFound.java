package com.barataribeiro.taskr.exceptions.organization;

public class OrganizationNotFound extends RuntimeException {
    public OrganizationNotFound() {
        super("Organization not found.");
    }
}
