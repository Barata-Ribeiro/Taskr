package com.barataribeiro.taskr.exceptions.generics;

public class UnauthorizedRequest extends RuntimeException {
    public UnauthorizedRequest() {
        super("You must be authenticated to access this resource.");
    }
}
