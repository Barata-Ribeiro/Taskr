package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    @EntityGraph(attributePaths = {"organizationUsers.organization", "projectUser.project", "taskUser.task"})
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByIdAndUsername(String id, String username);

    void deleteByIdAndUsername(String id, String username);
}