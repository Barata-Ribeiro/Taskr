package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.task.Task;
import com.barataribeiro.taskr.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class CommentTest {

    @Test
    @DisplayName("Comment builder sets all fields correctly")
    void builderSetsAllFieldsCorrectly() {
        User author = User.builder().username("author").build();
        Task task = Task.builder().title("Task 1").description("desc").assignee(author).project(null).build();
        Comment parent = Comment.builder().id(1L).content("parent").author(author).task(task).build();
        Instant now = Instant.now();

        Comment comment = Comment.builder()
                                 .id(2L)
                                 .content("child")
                                 .author(author)
                                 .task(task)
                                 .parent(parent)
                                 .createdAt(now)
                                 .updatedAt(now)
                                 .build();

        assertEquals(2L, comment.getId());
        assertEquals("child", comment.getContent());
        assertEquals(author, comment.getAuthor());
        assertEquals(task, comment.getTask());
        assertEquals(parent, comment.getParent());
        assertEquals(now, comment.getCreatedAt());
        assertEquals(now, comment.getUpdatedAt());
        assertNotNull(comment.getChildren());
    }

    @Test
    @DisplayName("Comment equals and hashCode with same values")
    void equalsAndHashCodeWithSameValues() {
        User author = User.builder().username("author").build();
        Task task = Task.builder().title("Task 1").description("desc").assignee(author).project(null).build();
        Instant now = Instant.now();

        Comment comment1 = Comment.builder()
                                  .id(1L)
                                  .content("abc")
                                  .author(author)
                                  .task(task)
                                  .createdAt(now)
                                  .updatedAt(now)
                                  .build();
        Comment comment2 = Comment.builder()
                                  .id(1L)
                                  .content("abc")
                                  .author(author)
                                  .task(task)
                                  .createdAt(now)
                                  .updatedAt(now)
                                  .build();

        assertEquals(comment1, comment2);
        assertEquals(comment1.hashCode(), comment2.hashCode());
    }
}