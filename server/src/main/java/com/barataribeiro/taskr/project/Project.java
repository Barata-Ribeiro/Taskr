package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.activity.Activity;
import com.barataribeiro.taskr.membership.Membership;
import com.barataribeiro.taskr.project.enums.ProjectStatus;
import com.barataribeiro.taskr.task.Task;
import com.barataribeiro.taskr.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_projects", indexes = {
        @Index(name = "idx_project_id_title", columnList = "id, title"),
        @Index(name = "idx_project_owner", columnList = "owner_id"),
        @Index(name = "idx_project_due_date", columnList = "due_date"),
        @Index(name = "idx_project_createdat", columnList = "createdAt")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_project_title_owner", columnNames = {"title", "owner_id"})
})
public class Project implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProjectStatus status = ProjectStatus.NOT_STARTED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private User owner;

    // Timestamps

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    // Relationships

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private Set<Membership> memberships = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private Set<Activity> feed = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonIgnore
    private Set<Task> tasks = new HashSet<>();

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(getId()).append(getTitle()).append(getStatus()).toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof Project project)) return false;

        return new EqualsBuilder()
                .append(getId(), project.getId())
                .append(getTitle(), project.getTitle())
                .append(getStatus(), project.getStatus())
                .isEquals();
    }
}
