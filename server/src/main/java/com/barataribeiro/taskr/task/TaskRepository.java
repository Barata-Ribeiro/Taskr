package com.barataribeiro.taskr.task;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.util.Streamable;

import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @EntityGraph(attributePaths = {"assignees"})
    Optional<Task> findByIdAndProject_Id(Long taskId, Long projectId);

    @EntityGraph(attributePaths = {"assignees"})
    Streamable<Task> findAllByProject_Id(Long id);
}