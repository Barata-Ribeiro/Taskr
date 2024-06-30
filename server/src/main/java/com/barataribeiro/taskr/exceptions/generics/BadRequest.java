package com.barataribeiro.taskr.exceptions.generics;

public class BadRequest extends RuntimeException {
    public BadRequest() {
        super("The server has encountered a situation it doesn't know how to handle.");
    }
}
