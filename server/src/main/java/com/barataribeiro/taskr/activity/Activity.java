package com.barataribeiro.taskr.activity;

import com.barataribeiro.taskr.project.Project;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
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
        @Index(name = "idx_activity_project", columnList = "project_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_activity_username_action_project",
                          columnNames = {"username", "action", "project_id"})
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
}
