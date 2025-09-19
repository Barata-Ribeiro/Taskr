package com.barataribeiro.taskr.features.comment;

import com.barataribeiro.taskr.config.specification.RepositorySpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long>,
        RepositorySpecificationExecutor<Comment, Long> {
    @Query(value = """
                   with recursive comment_tree(comment_id, content, author_id, was_edited, is_soft_deleted, task_id, parent_id, created_at, updated_at, user_id, username, role, display_name, avatar_url, is_private, is_verified) as (
                        select c.id, c.content, c.author_id, c.was_edited, c.is_soft_deleted, c.task_id, c.parent_id, c.created_at, c.updated_at, u.id, u.username, u.role, u.display_name, u.avatar_url, u.is_private, u.is_verified
                        from tb_comments c join tb_users u on c.author_id = u.id
                        where c.task_id = :taskId and c.parent_id is null
                        union all
                        select c.id, c.content, c.author_id, c.was_edited, c.is_soft_deleted, c.task_id, c.parent_id, c.created_at, c.updated_at, u.id, u.username, u.role, u.display_name, u.avatar_url, u.is_private, u.is_verified
                        from tb_comments c
                        join tb_users u on c.author_id = u.id
                        inner join comment_tree ct on c.parent_id = ct.comment_id)
                   select * from comment_tree;
                   """, nativeQuery = true)
    List<Object[]> findCommentTreeRaw(@Param("taskId") Long taskId);

    @EntityGraph(attributePaths = {"author", "task", "parent.author", "children.author"})
    Optional<Comment> findByIdAndAuthor_UsernameAndTask_Id(@Param("id") Long id, @Param("username") String username,
                                                           @Param("taskId") Long taskId);

    long deleteByIdAndTask_IdAndAuthor_Username(@Param("id") Long id, @Param("taskId") Long taskId,
                                                @Param("username") String username);
}