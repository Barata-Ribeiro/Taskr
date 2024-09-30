package com.barataribeiro.taskr.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table(name = "taskr_notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_seq")
    @SequenceGenerator(name = "notification_seq", sequenceName = "notification_seq", allocationSize = 1)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private boolean isRead = false;

    @Column(name = "issued_at", updatable = false)
    @CreationTimestamp
    private Instant issuedAt;

    @Column(name = "read_at")
    private Instant readAt;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PostPersist
    @PostUpdate
    @PostRemove
    public void updateUser() {
        user.lifeCycleActions();
    }
}