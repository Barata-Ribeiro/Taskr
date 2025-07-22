package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.task.enums.TaskStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @EntityGraph(attributePaths = {"assignees"})
    Optional<Task> findByIdAndProject_Id(@Param("taskId") Long taskId, @Param("projectId") Long projectId);

    @EntityGraph(attributePaths = {"assignees"})
    Streamable<Task> findAllByProject_Id(@Param("id") Long id);

    @EntityGraph(attributePaths = {"assignees"})
    Streamable<Task> findTop5ByProject_IdOrderByCreatedAtDesc(@Param("projectId") Long projectId);

    @EntityGraph(attributePaths = {"assignees"})
    List<Task> findAllByProject_IdAndStatusOrderByPositionAsc(@Param("projectId") Long projectId,
                                                              @Param("status") TaskStatus status);

    long countByProject_IdAndStatus(@Param("id") Long id, @Param("status") TaskStatus status);

    @EntityGraph(attributePaths = {"project.owner"})
    long deleteByIdAndProject_Owner_Username(@Param("id") Long id, @Param("username") String username);
}