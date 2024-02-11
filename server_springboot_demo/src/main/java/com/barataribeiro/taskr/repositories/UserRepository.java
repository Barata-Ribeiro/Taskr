package com.barataribeiro.taskr.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barataribeiro.taskr.entities.user.User;

public interface UserRepository extends JpaRepository<User, UUID> {
  User findByEmail(String email);

  User findByUsername(String username);
}
