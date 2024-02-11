package com.barataribeiro.taskr.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
  @Value("${api.security.jwt.token.secret}")
  private String secret;
  // TODO: implement the methods to generate and validate JWT tokens
}
