package com.barataribeiro.taskr.stats;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.ForbiddenRequestException;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.user.enums.Roles;
import com.barataribeiro.taskr.utils.TestSetupUtil;
import com.barataribeiro.taskr.utils.dtos.LoginReturnDTO;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class StatisticsControllerTest {
    private static String adminToken;
    private static String memberToken;
    private static ProjectDTO defaultProject;
    private static UUID memberUserId;
    private static UUID adminUserId;

    private final MockMvcTester mockMvcTester;
    private final MembershipRepository membershipRepository;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester) throws Exception {
        userRepository.deleteAll();

        // Register and login two users: one ADMIN, one MEMBER
        LoginReturnDTO loginReturn = TestSetupUtil
                .registerAndLoginDefaultUser(userRepository, userBuilder, mockMvcTester);
        memberToken = loginReturn.getAccessToken();
        adminToken = loginReturn.getSecondAccessToken();

        // Set ADMIN role for second user
        var adminUser = userRepository.findByUsername("awesomenewuser").orElseThrow();
        adminUser.setRole(Roles.ADMIN);
        userRepository.save(adminUser);

        // Re-authenticate admin to get a token with ADMIN role
        LoginRequestDTO adminLoginBody = new LoginRequestDTO();
        adminLoginBody.setUsernameOrEmail("awesomenewuser");
        adminLoginBody.setPassword("ovC1ZHL!&xE1ALbv*bdk$ANzN");
        AtomicReference<String> newAdminToken = new AtomicReference<>();
        final byte[] loginBody = Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(adminLoginBody);

        mockMvcTester.post().uri("/api/v1/auth/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(loginBody)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         newAdminToken.set(JsonPath.read(json, "$.data.accessToken"));
                         assertNotNull(newAdminToken.get(), "Admin access token should not be null");
                     });

        adminToken = newAdminToken.get();
        adminUserId = adminUser.getId();
        var memberUser = userRepository.findByUsername("newuser").orElseThrow();
        memberUserId = memberUser.getId();

        // Create a project with member as owner, add admin as member
        defaultProject = TestSetupUtil.createDefaultProject(mockMvcTester, memberToken).get();
    }

    @Test
    @Order(1)
    @DisplayName("It should retrieve global statistics for ADMIN user")
    void getGlobalStatsAsAdmin() {
        mockMvcTester.get().uri("/api/v1/stats/global")
                     .header("Authorization", "Bearer " + adminToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertNotNull(JsonPath.read(json, "$.data.totalUsers"));
                         assertNotNull(JsonPath.read(json, "$.data.totalProjects"));
                         assertNotNull(JsonPath.read(json, "$.data.totalTasks"));
                         assertNotNull(JsonPath.read(json, "$.data.totalComments"));
                         assertNotNull(JsonPath.read(json, "$.data.totalMemberships"));
                         assertNotNull(JsonPath.read(json, "$.data.totalActivities"));
                     });
    }

    @Test
    @Order(2)
    @DisplayName("It should forbid global statistics for MEMBER user")
    void getGlobalStatsAsMemberForbidden() {
        mockMvcTester.get().uri("/api/v1/stats/global")
                     .header("Authorization", "Bearer " + memberToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus4xxClientError()
                     .hasStatus(HttpStatus.FORBIDDEN)
                     .failure().isInstanceOf(AuthorizationDeniedException.class); // From @PreAuthorize annotation
    }

    @Test
    @Order(3)
    @DisplayName("It should retrieve project statistics for project member")
    void getProjectStatsAsMember() {
        mockMvcTester.get().uri("/api/v1/stats/project/{projectId}", defaultProject.getId())
                     .header("Authorization", "Bearer " + memberToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertNotNull(JsonPath.read(json, "$.data.totalTasks"));
                         assertNotNull(JsonPath.read(json, "$.data.tasksToDo"));
                         assertNotNull(JsonPath.read(json, "$.data.tasksInProgress"));
                         assertNotNull(JsonPath.read(json, "$.data.tasksDone"));
                         assertNotNull(JsonPath.read(json, "$.data.totalComments"));
                         assertNotNull(JsonPath.read(json, "$.data.totalMembers"));
                         assertNotNull(JsonPath.read(json, "$.data.totalActivities"));
                     });
    }

    @Test
    @Order(4)
    @DisplayName("It should forbid project statistics for non-member")
    void getProjectStatsAsNonMemberForbidden() {
        // Remove admin from project membership
        membershipRepository.findByUser_UsernameAndProject_Id("awesomenewuser", defaultProject.getId())
                            .ifPresent(membershipRepository::delete);

        mockMvcTester.get().uri("/api/v1/stats/project/{projectId}", defaultProject.getId())
                     .header("Authorization", "Bearer " + adminToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus4xxClientError()
                     .hasStatus(HttpStatus.NOT_FOUND)
                     .failure().isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    @Order(5)
    @DisplayName("It should retrieve user statistics for self")
    void getUserStatsAsSelf() {
        mockMvcTester.get().uri("/api/v1/stats/user/{userId}", memberUserId)
                     .header("Authorization", "Bearer " + memberToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertNotNull(JsonPath.read(json, "$.data.totalProjectsOwned"));
                         assertNotNull(JsonPath.read(json, "$.data.totalTasksAssigned"));
                         assertNotNull(JsonPath.read(json, "$.data.totalCommentsMade"));
                         assertNotNull(JsonPath.read(json, "$.data.totalMemberships"));
                     });
    }

    @Test
    @Order(6)
    @DisplayName("It should retrieve user statistics for ADMIN")
    void getUserStatsAsAdmin() {
        mockMvcTester.get().uri("/api/v1/stats/user/{userId}", memberUserId)
                     .header("Authorization", "Bearer " + adminToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertNotNull(JsonPath.read(json, "$.data.totalProjectsOwned"));
                         assertNotNull(JsonPath.read(json, "$.data.totalTasksAssigned"));
                         assertNotNull(JsonPath.read(json, "$.data.totalCommentsMade"));
                         assertNotNull(JsonPath.read(json, "$.data.totalMemberships"));
                     });
    }

    @Test
    @Order(7)
    @DisplayName("It should forbid user statistics for other MEMBER")
    void getUserStatsAsOtherMemberForbidden() {
        mockMvcTester.get().uri("/api/v1/stats/user/{userId}", adminUserId)
                     .header("Authorization", "Bearer " + memberToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus4xxClientError()
                     .hasStatus(HttpStatus.FORBIDDEN)
                     .failure().isInstanceOf(ForbiddenRequestException.class);
    }
}