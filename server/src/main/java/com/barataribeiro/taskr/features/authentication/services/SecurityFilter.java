package com.barataribeiro.taskr.features.authentication.services;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.taskr.features.authentication.TokenRepository;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SecurityFilter extends OncePerRequestFilter {
    private final RequestAttributeSecurityContextRepository filterRepository =
            new RequestAttributeSecurityContextRepository();
    private final TokenRepository tokenRepository;
    private final TokenService tokenService;

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
            return;
        }

        DecodedJWT decodedJWT = tokenService.validateToken(token);
        if (decodedJWT == null) {
            log.atWarn().log("Invalid token");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String jti = decodedJWT.getId();
        if (jti != null && tokenRepository.existsById(jti)) {
            log.atWarn().log("Token {} has been blacklisted", jti);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String username = decodedJWT.getSubject();
        String role = decodedJWT.getClaim("role").asString();
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(username, null, authorities);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        filterRepository.saveContext(context, request, response);

        log.atInfo().log("User {} authenticated with role {}. Request filtered, continuing...", username, role);

        filterChain.doFilter(request, response);
    }

    private @NotNull Boolean isWhitelistedPath(HttpServletRequest request) {
        for (String path : ApplicationConstants.getAuthWhitelist()) {
            if (PathPatternRequestMatcher.withDefaults().matcher(path).matches(request)) return true;
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
