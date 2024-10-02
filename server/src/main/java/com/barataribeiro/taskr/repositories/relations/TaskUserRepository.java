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
           SELECT t FROM TaskUser t
           WHERE t.task.id = :id AND t.isCreator = :isCreator OR t.isAssigned = :isAssigned
           ORDER BY t.user.username DESC
           """)
    Set<TaskUser> findTaskCreatorAndAssignedUsersByTaskId(Long id, boolean isCreator, boolean isAssigned);
}