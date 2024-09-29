package com.barataribeiro.taskr.models.embeddables;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class ProjectUserId implements Serializable {
    private Long projectId;
    private String userId;
}
