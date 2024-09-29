package com.barataribeiro.taskr.models.embeddables;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Embeddable
public class OrganizationProjectId implements Serializable {
    private Long organizationId;
    private Long projectId;

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(organizationId).append(projectId).toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof OrganizationProjectId that)) return false;

        return new EqualsBuilder().append(organizationId, that.organizationId).append(
                projectId, that.projectId).isEquals();
    }
}
