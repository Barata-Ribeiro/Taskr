package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.entities.Task;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {
    void deleteByTask(Task task);

    @Query("""
           SELECT p FROM ProjectTask p WHERE p.project.id = :id ORDER BY p.task.createdAt
           """)
    Set<ProjectTask> findAllByProject_id(Long id);

    Optional<ProjectTask> findByProject_IdAndTask_Id(Long projectId, Long taskId);


}