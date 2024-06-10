package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.Task;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "projects_tasks", indexes = {
        @Index(name = "idx_projecttask_unq", columnList = "project_id, task_id", unique = true)
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class ProjectTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
}
