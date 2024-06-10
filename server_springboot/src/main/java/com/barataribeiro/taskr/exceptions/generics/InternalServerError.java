package com.barataribeiro.taskr.exceptions.generics;

public class InternalServerError extends RuntimeException {
    public InternalServerError() {
        super("The server has encountered a situation it does not know how to handle.");
    }
}
