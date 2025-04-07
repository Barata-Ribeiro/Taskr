package com.barataribeiro.taskr.config;

import com.barataribeiro.taskr.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserHandshakeHandler extends DefaultHandshakeHandler {
    private final TokenService tokenService;

    @Value("${api.security.refresh_token.name}")
    private String refreshTokenName;

    @Override
    protected Principal determineUser(@NotNull ServerHttpRequest request,
                                      @NotNull WebSocketHandler wsHandler,
                                      @NotNull Map<String, Object> attributes) {

        List<String> authHeaders = request.getHeaders().get("cookie");

        if (authHeaders != null && !authHeaders.isEmpty()) {
            String cookieValue = authHeaders.getFirst();
            String tokenPrefix = String.format("%s=", refreshTokenName);
            String token = Arrays.stream(cookieValue.split(";"))
                                 .map(String::trim)
                                 .filter(s -> s.startsWith(tokenPrefix))
                                 .findFirst()
                                 .map(s -> s.substring(tokenPrefix.length()))
                                 .orElse(null);

            if (token != null) {
                String username = tokenService.getUsernameFromToken(token);
                if (username != null) {
                    log.atDebug().log("WebSocket connection authenticated for user: {}", username);
                    return new StompPrincipal(username);
                }
            }

            log.atDebug().log("WebSocket connection with invalid token");
        }

        return null;
    }
}
