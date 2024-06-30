package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.entities.Task;
import com.barataribeiro.taskr.models.relations.TaskUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface TaskUserRepository extends JpaRepository<TaskUser, Long> {
    void deleteByTask(Task task);

    @EntityGraph(attributePaths = {"user"})
    @Query("""
            select t from TaskUser t
            where t.task.id = :id and t.isCreator = :isCreator or t.isAssigned = :isAssigned
            order by t.user.username DESC""")
    Set<TaskUser> findTaskCreatorAndAssignedUsersByTaskId(Long id, boolean isCreator, boolean isAssigned);
}