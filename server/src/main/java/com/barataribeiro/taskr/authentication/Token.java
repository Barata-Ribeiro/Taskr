package com.barataribeiro.taskr.authentication;

import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_blacklisted_tokens", indexes = {
        @Index(name = "idx_token_tokenvalue_unq", columnList = "tokenValue, owner_username", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_token_token_value", columnNames = {"token_value"})
})
public class Token {
    @Id // The id is the JTI (JWT Token Identifier)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @Column(name = "token_value", nullable = false, unique = true)
    private String tokenValue;

    @Column(name = "owner_username", nullable = false)
    private String ownerUsername;

    @Column(name = "expiration_date", nullable = false)
    private Instant expirationDate;

    @Column(name = "blacklisted_at", nullable = false)
    @CreationTimestamp
    private Instant blacklistedAt;

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(getId())
                .append(getTokenValue())
                .append(getOwnerUsername())
                .toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof Token token)) return false;

        return new EqualsBuilder()
                .append(getId(), token.getId())
                .append(getTokenValue(), token.getTokenValue())
                .append(getOwnerUsername(), token.getOwnerUsername())
                .isEquals();
    }
}
