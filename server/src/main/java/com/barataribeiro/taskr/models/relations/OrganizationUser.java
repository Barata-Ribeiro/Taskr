package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.embeddables.OrganizationUserId;
import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "organizations_users", uniqueConstraints = {
        @UniqueConstraint(name = "uc_organization_user", columnNames = {"organization_id", "user_id"})
})
public class OrganizationUser implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @EmbeddedId
    private OrganizationUserId id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("organizationId")
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private boolean isAdmin = false;

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private boolean isOwner = false;
}
