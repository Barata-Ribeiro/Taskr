package com.barataribeiro.taskr.activity;

import com.barataribeiro.taskr.activity.enums.ActivityType;
import com.barataribeiro.taskr.project.Project;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "tb_activities", indexes = {
        @Index(name = "idx_activity_id_username", columnList = "id, username"),
        @Index(name = "idx_activity_project", columnList = "project_id"),
        @Index(name = "idx_activity_username", columnList = "username, project_id"),
        @Index(name = "idx_activity_createdat", columnList = "createdAt")
})
public class Activity implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "action", nullable = false)
    @Enumerated(EnumType.STRING)
    private ActivityType action;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    // Timestamps

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Project project;

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(getId()).append(getUsername()).append(getAction()).toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof Activity activity)) return false;

        return new EqualsBuilder()
                .append(getId(), activity.getId())
                .append(getUsername(), activity.getUsername())
                .append(getAction(), activity.getAction())
                .isEquals();
    }
}
