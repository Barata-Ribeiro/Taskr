package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.task.enums.TaskPriority;
import com.barataribeiro.taskr.task.enums.TaskStatus;
import com.barataribeiro.taskr.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class TaskTest {

    @Test
    @DisplayName("Task builder sets all fields correctly")
    void builderSetsAllFieldsCorrectly() {
        User assignee = User.builder().username("assignee").build();
        Project project = Project.builder().title("Project").description("desc").owner(assignee).build();
        Instant now = Instant.now();
        LocalDateTime localDateTime = LocalDateTime.ofInstant(now, ZoneOffset.UTC);
        HashSet<User> assignees = new HashSet<>();
        assignees.add(assignee);

        Task task = Task.builder()
                        .id(1L)
                        .title("Task 1")
                        .description("Task description")
                        .dueDate(localDateTime)
                        .status(TaskStatus.DONE)
                        .priority(TaskPriority.HIGH)
                        .position(1)
                        .createdAt(now)
                        .updatedAt(now)
                        .project(project)
                        .assignees(assignees)
                        .build();

        assertEquals(1L, task.getId());
        assertEquals("Task 1", task.getTitle());
        assertEquals("Task description", task.getDescription());
        assertEquals(localDateTime, task.getDueDate());
        assertEquals(TaskStatus.DONE, task.getStatus());
        assertEquals(TaskPriority.HIGH, task.getPriority());
        assertEquals(1, task.getPosition());
        assertEquals(now, task.getCreatedAt());
        assertEquals(now, task.getUpdatedAt());
        assertEquals(project, task.getProject());
        assertEquals(assignees, task.getAssignees());
        assertNotNull(task.getComments());
    }

    @Test
    @DisplayName("Task default status is TO_DO and priority is LOW")
    void defaultStatusIsToDoAndPriorityIsLow() {
        Task task = Task.builder().build();
        assertEquals(TaskStatus.TO_DO, task.getStatus());
        assertEquals(TaskPriority.LOW, task.getPriority());
        assertNotNull(task.getComments());
    }
}