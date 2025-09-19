package com.barataribeiro.taskr.features.notification;

import com.barataribeiro.taskr.features.notification.enums.NotificationType;
import com.barataribeiro.taskr.features.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_notifications", indexes = {
        @Index(name = "idx_notification_id_unq", columnList = "id, recipient_id", unique = true),
        @Index(name = "idx_notification_createdat", columnList = "createdAt")
})
public class Notification implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type = NotificationType.INFO;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Builder.Default
    @Column(name = "is_read", columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private boolean isRead = false;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
                .append(getId())
                .append(getTitle())
                .append(getType())
                .append(isRead())
                .toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof Notification that)) return false;

        return new EqualsBuilder()
                .append(isRead(), that.isRead())
                .append(getId(), that.getId())
                .append(getTitle(), that.getTitle())
                .append(getType(), that.getType())
                .isEquals();
    }
}
