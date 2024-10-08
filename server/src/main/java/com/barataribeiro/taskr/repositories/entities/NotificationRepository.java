package com.barataribeiro.taskr.repositories.entities;

import com.barataribeiro.taskr.models.entities.Notification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @EntityGraph(attributePaths = {"user"})
    List<Notification> findTop5ByUser_UsernameOrderByIssuedAtDesc(String username);
}