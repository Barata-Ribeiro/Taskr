package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ProjectTest {

    @Test
    @DisplayName("Project builder sets all fields correctly")
    void builderSetsAllFieldsCorrectly() {
        User owner = User.builder().username("owner").build();
        LocalDateTime due = LocalDateTime.now();
        Instant now = Instant.now();

        Project project = Project.builder()
                                 .id(1L)
                                 .title("Project X")
                                 .description("Description")
                                 .dueDate(due)
                                 .status(ProjectStatus.IN_PROGRESS)
                                 .owner(owner)
                                 .createdAt(now)
                                 .updatedAt(now)
                                 .build();

        assertEquals(1L, project.getId());
        assertEquals("Project X", project.getTitle());
        assertEquals("Description", project.getDescription());
        assertEquals(due, project.getDueDate());
        assertEquals(ProjectStatus.IN_PROGRESS, project.getStatus());
        assertEquals(owner, project.getOwner());
        assertEquals(now, project.getCreatedAt());
        assertEquals(now, project.getUpdatedAt());
        assertNotNull(project.getMemberships());
        assertNotNull(project.getFeed());
        assertNotNull(project.getTasks());
    }

    @Test
    @DisplayName("Project default status is NOT_STARTED and collections are initialized")
    void defaultStatusIsNotStartedAndCollectionsInitialized() {
        Project project = Project.builder().build();
        assertEquals(ProjectStatus.NOT_STARTED, project.getStatus());
        assertNotNull(project.getMemberships());
        assertNotNull(project.getFeed());
        assertNotNull(project.getTasks());
    }
}