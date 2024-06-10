package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.Project;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizations_projects", indexes = {
        @Index(name = "idx_organizationproject_unq", columnList = "organization_id, project_id", unique = true)
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrganizationProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
