package com.barataribeiro.taskr.repositories.relations;

import com.barataribeiro.taskr.models.relations.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {
}