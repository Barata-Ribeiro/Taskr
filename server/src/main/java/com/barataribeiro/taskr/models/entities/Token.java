package com.barataribeiro.taskr.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "taskr_blacklist", uniqueConstraints = {
        @UniqueConstraint(name = "uc_blacklist_token", columnNames = {"token"})
})
public class Token {
    @Id // The id is the JTI (JWT Token Identifier)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "owner_username", nullable = false)
    private String ownerUsername;

    @Column(name = "expiration_date", nullable = false)
    private Instant expirationDate;

    @Column(name = "blacklisted_at", nullable = false)
    @CreationTimestamp
    private Instant blacklistedAt;

}
