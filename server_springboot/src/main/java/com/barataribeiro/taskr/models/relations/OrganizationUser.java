package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "organizations_users", indexes = {
        @Index(name = "idx_organizationsusers_unq", columnList = "organization_id, user_id", unique = true)
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrganizationUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private boolean isAdmin = false;
    private boolean isOwner = false;
}
