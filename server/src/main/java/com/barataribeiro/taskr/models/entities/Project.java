package com.barataribeiro.taskr.models.entities;

import com.barataribeiro.taskr.models.relations.OrganizationProject;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import com.barataribeiro.taskr.models.relations.ProjectUser;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "taskr_projects", uniqueConstraints = {
        @UniqueConstraint(name = "uc_project_name", columnNames = {"name"})
})
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq")
    @SequenceGenerator(name = "project_seq", sequenceName = "project_seq", allocationSize = 1)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @NotBlank(message = "Project name is required.")
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank(message = "Project description is required.")
    @Column(nullable = false)
    private String description;

    @NotNull(message = "Deadline is required.")
    @Column(nullable = false)
    private LocalDate deadline;

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

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OrganizationProject> organizationProjects = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProjectTask> projectTask = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProjectUser> projectUser = new LinkedHashSet<>();

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
