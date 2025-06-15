package com.barataribeiro.taskr.membership;

import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.enums.ProjectRole;
import com.barataribeiro.taskr.user.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MembershipTest {

    @Test
    @DisplayName("Membership builder sets all fields correctly")
    void builderSetsAllFieldsCorrectly() {
        Project project = Project.builder().title("Project").description("desc").owner(null).build();
        User user = User.builder().username("member").build();
        LocalDateTime joined = LocalDateTime.now();

        Membership membership = Membership.builder()
                                          .id(1L)
                                          .project(project)
                                          .user(user)
                                          .role(ProjectRole.OWNER)
                                          .joinedAt(joined)
                                          .build();

        assertEquals(1L, membership.getId());
        assertEquals(project, membership.getProject());
        assertEquals(user, membership.getUser());
        assertEquals(ProjectRole.OWNER, membership.getRole());
        assertEquals(joined, membership.getJoinedAt());
    }

    @Test
    @DisplayName("Membership default role is MEMBER")
    void defaultRoleIsMember() {
        Membership membership = Membership.builder().build();
        assertEquals(ProjectRole.MEMBER, membership.getRole());
    }
}