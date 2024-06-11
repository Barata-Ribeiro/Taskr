package com.barataribeiro.taskr.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "taskr_projects", indexes = {
        @Index(name = "idx_project_name_unq", columnList = "name", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_project_name", columnNames = {"name"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false, unique = true)
    @NotNull
    @NotEmpty
    private String name;

    @Column(nullable = false)
    @NotNull
    @NotEmpty
    private String description;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long membersCount = 0L;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long tasksCount = 0L;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public void incrementMembersCount() {
        this.membersCount++;
    }

    public void decrementMembersCount() {
        this.membersCount = this.membersCount > 0 ? this.membersCount - 1 : 0;
    }

    public void incrementTasksCount() {
        this.tasksCount++;
    }

    public void decrementTasksCount() {
        this.tasksCount = this.tasksCount > 0 ? this.tasksCount - 1 : 0;
    }
}
