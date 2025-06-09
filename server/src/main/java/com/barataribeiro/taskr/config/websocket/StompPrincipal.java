package com.barataribeiro.taskr.config.websocket;

import lombok.RequiredArgsConstructor;

import java.security.Principal;

@RequiredArgsConstructor
public class StompPrincipal implements Principal {
    private final String name;

    @Override
    public String getName() {
        return name;
    }
}
