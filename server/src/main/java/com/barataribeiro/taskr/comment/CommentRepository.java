package com.barataribeiro.taskr.comment;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long>, JpaSpecificationExecutor<Comment> {
    long countDistinctByAuthor_Username(@Param("username") String username);

    @EntityGraph(attributePaths = {"author", "task", "parent", "children"})
    Optional<Comment> findByIdAndAuthor_UsernameAndTask_Id(@Param("id") Long id, @Param("username") String username,
                                                           @Param("taskId") Long taskId);

    @EntityGraph(attributePaths = {"author", "parent", "children"})
    Streamable<Comment> findByTask_IdOrderByCreatedAtDesc(@Param("taskId") Long taskId);

    long deleteByIdAndTask_IdAndAuthor_Username(@Param("id") Long id, @Param("taskId") Long taskId,
                                                @Param("username") String username);
}