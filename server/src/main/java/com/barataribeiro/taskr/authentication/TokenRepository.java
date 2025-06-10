package com.barataribeiro.taskr.authentication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TokenRepository extends JpaRepository<Token, String>, JpaSpecificationExecutor<Token> {
}