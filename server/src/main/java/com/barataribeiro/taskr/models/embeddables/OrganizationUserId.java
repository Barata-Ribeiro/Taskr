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
public class OrganizationUserId implements Serializable {
    private Long organizationId;
    private String userId;

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(getOrganizationId()).append(getUserId()).toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof OrganizationUserId that)) return false;

        return new EqualsBuilder()
                .append(getOrganizationId(), that.getOrganizationId())
                .append(getUserId(), that.getUserId())
                .isEquals();
    }
}
