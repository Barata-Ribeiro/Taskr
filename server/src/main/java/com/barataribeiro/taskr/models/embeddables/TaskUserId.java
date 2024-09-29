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
public class TaskUserId implements Serializable {
    private Long taskId;
    private String userId;
}
