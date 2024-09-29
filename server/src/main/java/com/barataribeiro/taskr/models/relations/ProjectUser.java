package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.embeddables.ProjectUserId;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.User;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "projects_users", uniqueConstraints = {
        @UniqueConstraint(name = "uc_project_user", columnNames = {"project_id", "user_id"})
})
public class ProjectUser {
    @EmbeddedId
    private ProjectUserId id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("projectId")
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private boolean isProjectManager = false;
}
