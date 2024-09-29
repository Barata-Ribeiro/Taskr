package com.barataribeiro.taskr.models.entities;

import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table(name = "taskr_tasks", indexes = {
        @Index(name = "idx_task_title_unq", columnList = "title", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_task_title", columnNames = {"title"})
})
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "task_seq")
    @SequenceGenerator(name = "task_seq", sequenceName = "task_seq", allocationSize = 1)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @NotBlank(message = "Title is required.")
    @Column(nullable = false, unique = true)
    private String title;

    @NotBlank(message = "Description is required.")
    @Column(nullable = false)
    private String description;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.OPEN;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TaskPriority priority = TaskPriority.LOW;

    @Column(nullable = false)
    @NotNull(message = "Start date is required.")
    private Date startDate;

    @Column(nullable = false)
    @NotNull(message = "Due date is required.")
    private Date dueDate;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
