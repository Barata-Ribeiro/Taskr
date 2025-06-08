package com.barataribeiro.taskr.authentication.services;

import com.barataribeiro.taskr.config.ApplicationConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SecurityFilter extends OncePerRequestFilter {
    private final RequestAttributeSecurityContextRepository filterRepository =
            new RequestAttributeSecurityContextRepository();

    @Override
    protected void doFilterInternal(final @NonNull HttpServletRequest request,
                                    final @NonNull HttpServletResponse response,
                                    final @NonNull FilterChain filterChain) throws ServletException, IOException {
        if (isWhitelistedPath(request)) {
            log.atInfo().log("Skipping filter for path: {}", request.getServletPath());
            filterChain.doFilter(request, response);
            return;
        }

        log.atInfo().log("Filtering request...");

        String token = recoverToken(request);
        if (token == null || token.isBlank()) {
            log.atWarn().log("Token not found in servlet request");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private @NotNull Boolean isWhitelistedPath(HttpServletRequest request) {
        for (String path : ApplicationConstants.getAuthWhitelist()) {
            if (new AntPathRequestMatcher(path).matches(request)) {
                return true;
            }
        }

        return false;
    }

    private @Nullable String recoverToken(@NotNull HttpServletRequest request) {
        log.atInfo().log("Recovering token from request");

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            log.atInfo().log("Token found in request");
            return authHeader.replace("Bearer ", "");
        }

        return null;
    }
}
