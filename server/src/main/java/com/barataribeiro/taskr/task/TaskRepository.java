package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.task.enums.TaskStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @EntityGraph(attributePaths = {"project", "assignees"})
    Optional<Task> findByIdAndProject_Id(@Param("taskId") Long taskId, @Param("projectId") Long projectId);

    @EntityGraph(attributePaths = {"assignees"})
    Streamable<Task> findAllByProject_Id(@Param("id") Long id);

    @Query("SELECT t.id FROM Task t WHERE t.project.id = :projectId ORDER BY t.createdAt DESC")
    List<Long> findTop5TaskIdsByProjectIdOrderByCreatedAtDesc(@Param("projectId") Long projectId, Pageable pageable);

    @EntityGraph(attributePaths = {"assignees"})
    @Query("SELECT t FROM Task t WHERE t.id IN :ids")
    List<Task> findTasksWithAssigneesByIdIn(@Param("ids") List<Long> ids);

    @EntityGraph(attributePaths = {"assignees"})
    List<Task> findAllByProject_IdAndStatusOrderByPositionAsc(@Param("projectId") Long projectId,
                                                              @Param("status") TaskStatus status);

    long countByProject_IdAndStatus(@Param("id") Long id, @Param("status") TaskStatus status);

    @EntityGraph(attributePaths = {"project.owner"})
    long deleteByIdAndProject_IdAndProject_Owner_Username(@Param("taskId") Long taskId,
                                                          @Param("projectId") Long projectId,
                                                          @Param("username") String username);
}