package com.barataribeiro.taskr.features.notification;

import com.barataribeiro.taskr.config.specification.RepositorySpecificationExecutor;
import com.barataribeiro.taskr.features.notification.dtos.TotalNotifications;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, Long>,
        RepositorySpecificationExecutor<Notification, Long> {
    long countByRecipient_Id(@Param("recipientId") UUID recipientId);

    @Query("SELECT n.id FROM Notification n JOIN n.recipient WHERE n.recipient.username = :username")
    Page<Long> findAllIdsByRecipient_Username(@Param("username") String username, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"recipient"})
    @NotNull List<Notification> findAll(Specification<Notification> spec);

    @EntityGraph(attributePaths = {"recipient"})
    Optional<Notification> findByIdAndRecipient_Username(@Param("id") Long id, @Param("username") String username);

    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findDistinctByIdInAndRecipient_Username(@Param("ids") Collection<Long> ids,
                                                               @Param("username") String username);

    @Query("""
           SELECT new com.barataribeiro.taskr.features.notification.dtos.TotalNotifications(
                COUNT(n),
                COUNT(CASE WHEN n.isRead = true THEN 1 ELSE 0 END),
                COUNT(CASE WHEN n.isRead = false THEN 1 ELSE 0 END)
           )
           FROM Notification n
           WHERE n.recipient.username = :username
           """)
    TotalNotifications getNotificationCountsByRecipient_Username(@Param("username") String username);

    long deleteByIdAndRecipient_Username(@Param("id") Long id, @Param("username") String username);

    long deleteByIdInAndRecipient_Username(@Param("ids") Collection<Long> ids, @Param("username") String username);
}