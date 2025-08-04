package com.barataribeiro.taskr.authentication;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class TokenCleanupScheduler {
    private final TokenRepository tokenRepository;

    @PostConstruct
    public void verifyServerIsRunning() {
        log.atInfo().log("Token cleanup scheduler initialized. Server is running.");
        log.atInfo().log("There are {} tokens in the database.", tokenRepository.count());

        this.cleanupExpiredTokens();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupExpiredTokens() {
        log.atInfo().log("Starting token cleanup process...");
        List<Token> expiredTokens = tokenRepository.findAllByExpirationDateBefore(Instant.now());

        if (expiredTokens.isEmpty()) log.atInfo().log("No expired tokens found. Continuing...");

        tokenRepository.deleteAll(expiredTokens);

        log.atInfo().log("Token cleanup process completed. {} expired tokens removed.", expiredTokens.size());
    }
}
