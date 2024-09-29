package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.embeddables.ProjectTaskId;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.Task;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "projects_tasks", uniqueConstraints = {
        @UniqueConstraint(name = "uc_project_task", columnNames = {"project_id", "task_id"})
})
public class ProjectTask {
    @EmbeddedId
    private ProjectTaskId id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("projectId")
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("taskId")
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
}
