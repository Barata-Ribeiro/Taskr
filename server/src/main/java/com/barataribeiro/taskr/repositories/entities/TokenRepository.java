package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, String> {
}