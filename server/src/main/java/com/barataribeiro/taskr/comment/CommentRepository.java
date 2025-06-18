package com.barataribeiro.taskr.comment;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

public interface CommentRepository extends JpaRepository<Comment, Long>, JpaSpecificationExecutor<Comment> {
    long countDistinctByTask_Id(Long taskId);

    long countDistinctByAuthor_Username(@Param("username") String username);

    @EntityGraph(attributePaths = {"author", "parent", "children"})
    Streamable<Comment> findByTask_IdOrderByCreatedAtDesc(Long taskId);
}