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
public class ProjectTaskId implements Serializable {
    private Long projectId;
    private Long taskId;

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37).append(getProjectId()).append(getTaskId()).toHashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof ProjectTaskId that)) return false;

        return new EqualsBuilder().append(getProjectId(), that.getProjectId()).append(
                getTaskId(), that.getTaskId()).isEquals();
    }
}
