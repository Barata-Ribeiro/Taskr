package com.barataribeiro.taskr.config.websocket;

import com.barataribeiro.taskr.features.authentication.services.TokenService;
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
        List<String> cookies = request.getHeaders().get("cookie");

        if (cookies == null || cookies.isEmpty()) {
            log.atDebug().log("No cookies found in request headers");
            return null;
        }

        String cookieValue = cookies.getFirst();
        String tokenPrefix = String.format("%s=", refreshTokenName);
        String token = Arrays.stream(cookieValue.split(";"))
                             .map(String::trim)
                             .filter(cookie -> cookie.startsWith(tokenPrefix))
                             .findFirst()
                             .map(cookie -> cookie.substring(tokenPrefix.length()))
                             .orElse(null);

        if (token == null) {
            log.atDebug().log("No valid token found in cookies");
            return null;
        }

        String username = tokenService.getUsernameFromToken(token);
        if (username == null) {
            log.atDebug().log("No username found for token: {}", token);
            return null;
        }

        log.atDebug().log("User {} connected via WebSocket", username);
        return new StompPrincipal(username);
    }
}
