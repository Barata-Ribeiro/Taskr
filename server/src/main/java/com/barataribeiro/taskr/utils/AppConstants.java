package com.barataribeiro.taskr.utils;

public final class AppConstants {
    public static final String AUTH_0 = "auth0";
    public static final String CANNOT_BE_AFTER_DUE_DATE = "Start date cannot be after due date.";
    public static final String CANNOT_BE_IN_THE_PAST = "Due date cannot be in the past.";
    public static final String CREATED_AT = "createdAt";
    public static final String MANAGER = "manager";
    public static final String NOT_THE_OWNER_OF_THIS_ORGANIZATION = "You are not the owner of this organization.";
    public static final String ORGANIZATION = "organization";
    public static final String PROJECT = "project";

    private AppConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
