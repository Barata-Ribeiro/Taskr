package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.config.specification.RepositorySpecificationExecutor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long>,
        RepositorySpecificationExecutor<Comment, Long> {
    @EntityGraph(attributePaths = {"author", "task", "parent.author", "children.author"})
    Optional<Comment> findByIdAndAuthor_UsernameAndTask_Id(@Param("id") Long id, @Param("username") String username,
                                                           @Param("taskId") Long taskId);

    @Query("""
           SELECT c.id
           FROM Comment c LEFT JOIN c.task t
           WHERE t.id = :taskId
           ORDER BY c.parent.id NULLS FIRST, c.createdAt DESC
           """)
    Page<Long> findAllIdsByTask_Id(@Param("taskId") Long taskId, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"author", "task", "parent.author", "children.author"})
    @NotNull List<Comment> findAll(Specification<Comment> spec);

    long deleteByIdAndTask_IdAndAuthor_Username(@Param("id") Long id, @Param("taskId") Long taskId,
                                                @Param("username") String username);
}