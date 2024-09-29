package com.barataribeiro.taskr.models.entities;

import com.barataribeiro.taskr.models.relations.OrganizationProject;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.URL;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "taskr_organization", uniqueConstraints = {
        @UniqueConstraint(name = "uc_organization_name", columnNames = {"name"})
})
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "organization_seq")
    @SequenceGenerator(name = "organization_seq", sequenceName = "organization_seq", allocationSize = 1)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @NotBlank(message = "Organization name is required.")
    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long membersCount = 0L;

    @Builder.Default
    @Column(columnDefinition = "BIGINT default '0'", nullable = false)
    private Long projectsCount = 0L;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String logoUrl;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String websiteUrl;

    private String location;

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OrganizationProject> organizationProjects = new LinkedHashSet<>();

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