package com.barataribeiro.taskr.models.entities;

import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.enums.TaskStatus;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import com.barataribeiro.taskr.models.relations.TaskUser;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Builder
@Entity
@Table(name = "taskr_tasks", uniqueConstraints = {
        @UniqueConstraint(name = "uc_task_title", columnNames = {"title"})
})
public class Task implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

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

    @NotNull(message = "Start date is required.")
    @Column(nullable = false)
    private LocalDate startDate;

    @NotNull(message = "Due date is required.")
    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    private Set<ProjectTask> projectTask = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    private Set<TaskUser> taskUser = new LinkedHashSet<>();
}
