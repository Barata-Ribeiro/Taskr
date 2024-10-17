package com.barataribeiro.taskr.models.relations;

import com.barataribeiro.taskr.models.embeddables.TaskUserId;
import com.barataribeiro.taskr.models.entities.Task;
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
@Table(name = "tasks_users", uniqueConstraints = {
        @UniqueConstraint(name = "uc_task_user", columnNames = {"task_id", "user_id"})
})
public class TaskUser implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    
    @EmbeddedId
    private TaskUserId id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("taskId")
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private boolean isCreator = false;

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private boolean isAssigned = false;
}
