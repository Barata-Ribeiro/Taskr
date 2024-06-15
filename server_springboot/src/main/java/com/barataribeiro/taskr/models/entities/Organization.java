package com.barataribeiro.taskr.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "taskr_organization", indexes = {
        @Index(name = "idx_organization_name_unq", columnList = "name", unique = true)
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_organization_name", columnNames = {"name"})
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "organization_seq")
    @SequenceGenerator(name = "organization_seq", sequenceName = "organization_seq", allocationSize = 1)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotNull
    @NotEmpty(message = "Organization name is required.")
    private String name;

    private String description;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long membersCount = 0L;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long projectsCount = 0L;

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

    public void incrementProjectsCount() {
        this.projectsCount++;
    }

    public void decrementProjectsCount() {
        this.projectsCount = this.projectsCount > 0 ? this.projectsCount - 1 : 0;
    }
}