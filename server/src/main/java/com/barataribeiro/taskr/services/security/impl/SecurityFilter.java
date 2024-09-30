package com.barataribeiro.taskr.services.security.impl;

import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.services.security.TokenService;
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
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SecurityFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final RequestAttributeSecurityContextRepository filterRepository =
            new RequestAttributeSecurityContextRepository();

    @Override
    protected void doFilterInternal(final @NonNull HttpServletRequest request,
                                    final @NonNull HttpServletResponse response,
                                    final @NonNull FilterChain filterChain) throws ServletException, IOException {
        log.atInfo().log("Filtering request");
        String token = recoverToken(request);
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        if (token != null) {
            var login = tokenService.validateToken(token);

            if (login != null) {
                User user = userRepository.findByUsername(login).orElseThrow(() -> new EntityNotFoundException("User"));

                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);

                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
                filterRepository.saveContext(context, request, response);

                log.atInfo().log("User {} authenticated", user.getUsername());
            }
        }

        filterChain.doFilter(request, response);
    }

    private @Nullable String recoverToken(@NotNull HttpServletRequest request) {
        log.atInfo().log("Recovering token from request");

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            log.atInfo().log("Token found in request");
            return authHeader.replace("Bearer ", "");
        }

        log.atWarn().log("Token not found in request");

        return null;
    }
}
