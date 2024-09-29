package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.embeddables.OrganizationProjectId;
import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "organizations_projects", uniqueConstraints = {
        @UniqueConstraint(name = "uc_organization_project", columnNames = {"organization_id", "project_id"})
})
public class OrganizationProject {
    @EmbeddedId
    private OrganizationProjectId id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("organizationId")
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("projectId")
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.AWAITING_APPROVAL;
}
