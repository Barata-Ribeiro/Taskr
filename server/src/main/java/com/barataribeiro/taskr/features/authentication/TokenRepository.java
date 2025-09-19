package com.barataribeiro.taskr.features.authentication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface TokenRepository extends JpaRepository<Token, String>, JpaSpecificationExecutor<Token> {
    List<Token> findAllByExpirationDateBefore(@Param("now") Instant now);
}