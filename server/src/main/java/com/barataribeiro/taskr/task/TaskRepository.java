package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.config.specification.RepositorySpecificationExecutor;
import com.barataribeiro.taskr.task.enums.TaskStatus;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long>, RepositorySpecificationExecutor<Task, Long> {
    @EntityGraph(attributePaths = {"project", "assignees"})
    Optional<Task> findByIdAndProject_Id(@Param("taskId") Long taskId, @Param("projectId") Long projectId);

    @Query("SELECT t.id FROM Task t JOIN t.project WHERE t.project.id = :projectId")
    Page<Long> findAllIdsByProject_Id(@Param("projectId") Long projectId, Pageable pageable);

    @EntityGraph(attributePaths = {"assignees"})
    Streamable<Task> findAllByProject_Id(@Param("id") Long id);

    @Override
    @EntityGraph(attributePaths = {"project", "assignees"})
    @NotNull List<Task> findAll(Specification<Task> spec);

    @EntityGraph(attributePaths = {"assignees"})
    List<Task> findAllByProject_IdAndStatusOrderByPositionAsc(@Param("projectId") Long projectId,
                                                              @Param("status") TaskStatus status);

    long countByProject_IdAndStatus(@Param("id") Long id, @Param("status") TaskStatus status);

    long deleteByIdAndProject_IdAndProject_Owner_Username(@Param("taskId") Long taskId,
                                                          @Param("projectId") Long projectId,
                                                          @Param("username") String username);
}