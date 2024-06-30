package com.barataribeiro.taskr.exceptions.generics;

public class ForbiddenRequest extends RuntimeException {
    public ForbiddenRequest() {
        super("You do not have permission to access this resource.");
    }
}
