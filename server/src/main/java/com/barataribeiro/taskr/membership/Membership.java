package com.barataribeiro.taskr.membership;

import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.enums.ProjectRole;
import com.barataribeiro.taskr.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_memberships", indexes = {
        @Index(name = "idx_membership_id_project_user", columnList = "id, project_id, user_id"),
        @Index(name = "idx_membership_project_user_unq", columnList = "project_id, user_id", unique = true),
        @Index(name = "idx_membership_joinedat", columnList = "joinedAt")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_membership_project_user", columnNames = {"project_id", "user_id"})
})
public class Membership implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @JsonIgnore
    private User user;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private ProjectRole role = ProjectRole.MEMBER;

    private LocalDateTime joinedAt;

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(getId()).toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof Membership that)) return false;

        return new EqualsBuilder().append(getId(), that.getId()).isEquals();
    }
}
