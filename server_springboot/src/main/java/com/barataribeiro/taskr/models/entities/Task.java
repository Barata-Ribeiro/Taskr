package com.barataribeiro.taskr.models.entities;

import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "taskr_tasks", indexes = {
        @Index(name = "idx_task_title_unq", columnList = "title", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_task_title", columnNames = {"title"})
})
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false, unique = true)
    private Integer id;

    @Column(nullable = false, unique = true)
    @NotNull
    @NotEmpty
    private String title;

    @Column(nullable = false)
    @NotNull
    @NotEmpty
    private String description;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.OPEN;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TaskPriority priority = TaskPriority.LOW;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
