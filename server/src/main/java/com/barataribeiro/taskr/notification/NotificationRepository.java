package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.notification.dtos.TotalNotifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>,
        JpaSpecificationExecutor<Notification> {

    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findTop5ByRecipient_UsernameOrderByCreatedAtDesc(@Param("username") String username);

    @EntityGraph(attributePaths = {"recipient"})
    Page<Notification> findAllByRecipient_Username(@Param("username") String username, Pageable pageable);

    @Query("""
           SELECT new com.barataribeiro.taskr.notification.dtos.TotalNotifications(
                COUNT(n),
                COUNT(CASE WHEN n.isRead = true THEN 1 ELSE 0 END),
                COUNT(CASE WHEN n.isRead = false THEN 1 ELSE 0 END)
           )
           FROM Notification n
           WHERE n.recipient.username = :username
           """)
    TotalNotifications getNotificationCountsByRecipient_Username(@Param("username") String username);
}