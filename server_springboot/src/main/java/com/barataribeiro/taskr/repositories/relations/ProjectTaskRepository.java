package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.entities.Task;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {
    void deleteByTask(Task task);

    @Query("select p from ProjectTask p where p.project.id = :id order by p.task.createdAt")
    Set<ProjectTask> findAllByProject_id(Integer id);

    Optional<ProjectTask> findByProject_IdAndTask_Id(Integer projectId, Integer taskid);


}