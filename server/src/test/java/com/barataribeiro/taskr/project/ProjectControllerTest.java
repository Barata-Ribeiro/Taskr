package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.activity.ActivityRepository;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import com.barataribeiro.taskr.project.dtos.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.utils.TestSetupUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ProjectControllerTest {
    private static final ProjectRequestDTO projectRequestDTO = new ProjectRequestDTO();
    private static String accessToken;
    private static ProjectDTO createdProject;

    private final MockMvcTester mockMvcTester;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester) throws Exception {
        userRepository.deleteAll();

        accessToken = TestSetupUtil.registerAndLoginDefaultUser(userRepository, userBuilder, mockMvcTester)
                                   .getAccessToken();
    }

    @AfterAll
    static void tearDown(@Autowired @NotNull UserRepository userRepository) {
        userRepository.deleteAll();
        accessToken = null;
        createdProject = null;
    }

    @Test
    @Order(1)
    @DisplayName("It should create a new project for the authenticated user")
    void createProject() throws Exception {
        projectRequestDTO.setTitle("Test Project");
        projectRequestDTO.setDescription("This is a test project.");
        projectRequestDTO.setDueDate(LocalDateTime.now().plusDays(30)
                                                  .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));

        mockMvcTester.post().uri("/api/v1/projects/create")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(projectRequestDTO))
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals(projectRequestDTO.getTitle(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.title"),
                                      "Project title should match");
                         assertEquals(projectRequestDTO.getDescription(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.description"),
                                      "Project description should match");
                         assertEquals(projectRequestDTO.getDueDate(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.dueDate"),
                                      "Project due date should match");

                         ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();
                         createdProject = objectMapper.convertValue(JsonPath.read(jsonContent.getJson(), "$.data"),
                                                                    ProjectDTO.class
                         );
                     });

        assertNotNull(createdProject, "Created project should not be null");
    }

    @Test
    @Order(2)
    @DisplayName("It should get all projects of the authenticated user")
    void getMyProjects() {
        mockMvcTester.get().uri("/api/v1/projects/my")
                     .header("Authorization", "Bearer " + accessToken)
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data.content"),
                                       "Project content should not be null");
                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data.content[0]"),
                                       "First project should not be null");
                         assertEquals(createdProject.getTitle(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.content[0].title"),
                                      "First project title should match");
                     });
    }

    @Test
    @Order(3)
    @DisplayName("It should get the project by its ID")
    void getProjectById() {
        mockMvcTester.get().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals(createdProject.getId(),
                                      ((Number) JsonPath.read(jsonContent.getJson(), "$.data.id")).longValue(),
                                      "Project ID should match");
                         assertEquals(createdProject.getTitle(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.title"),
                                      "Project title should match");
                         assertEquals(createdProject.getDescription(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.description"),
                                      "Project description should match");
                         assertEquals(String.valueOf(createdProject.getDueDate()),
                                      JsonPath.read(jsonContent.getJson(), "$.data.dueDate"),
                                      "Project due date should match"
                         );
                     });
    }

    @Test
    @Order(4)
    @DisplayName("It should update the project title and description successfully")
    void updateProjectTitleAndDescription() throws Exception {
        ProjectUpdateRequestDTO updateRequest = new ProjectUpdateRequestDTO();
        updateRequest.setTitle("Updated Project Title");
        updateRequest.setDescription("Updated project description.");

        mockMvcTester.patch().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertEquals("Updated Project Title", JsonPath.read(json, "$.data.title"),
                                      "Project title should be updated");
                         assertEquals("Updated project description.", JsonPath.read(json, "$.data.description"),
                                      "Project description should be updated");
                     });
    }

    @Test
    @Order(5)
    @DisplayName("It should not update the project with a past due date")
    void updateProjectWithPastDueDateShouldFail() throws Exception {
        ProjectUpdateRequestDTO updateRequest = new ProjectUpdateRequestDTO();
        updateRequest.setDueDate(LocalDateTime.now().minusDays(1)
                                              .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));

        mockMvcTester.patch().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @Order(6)
    @DisplayName("It should not update the project if no fields are provided")
    void updateProjectWithNoFieldsShouldFail() throws Exception {
        ProjectUpdateRequestDTO updateRequest = new ProjectUpdateRequestDTO();

        mockMvcTester.patch().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @Order(7)
    @DisplayName("It should not update the project with an invalid status")
    void updateProjectWithInvalidStatusShouldFail() throws Exception {
        ProjectUpdateRequestDTO updateRequest = new ProjectUpdateRequestDTO();
        updateRequest.setStatus("INVALID_STATUS");

        mockMvcTester.patch().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(MethodArgumentNotValidException.class);
    }

    @Test
    @Order(8)
    @DisplayName("It should add a member and then remove then from the project")
    void addAndRemoveMemberFromProject() throws Exception {
        ProjectUpdateRequestDTO updateRequest = new ProjectUpdateRequestDTO();
        updateRequest.setMembersToAdd(List.of("awesomenewuser"));

        mockMvcTester.patch().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         String username = updateRequest.getMembersToAdd().getFirst();
                         List<String> members = JsonPath.read(json, "$.data.memberships[*].user.username");
                         assertTrue(members.contains(username), "New member should be added to the project");
                     });

        updateRequest.setMembersToAdd(List.of());
        updateRequest.setMembersToRemove(List.of("awesomenewuser"));

        mockMvcTester.patch().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         List<String> members = JsonPath.read(json, "$.data.memberships[*].user.username");
                         assertEquals(1, members.size(), "Member should be removed from the project");
                     });
    }

    @Test
    @Order(9)
    @DisplayName("It should not delete a project that does not exist")
    void deleteNonExistentProject() {
        mockMvcTester.delete().uri("/api/v1/projects/999999")
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus4xxClientError()
                     .hasStatus(HttpStatus.NOT_FOUND)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertEquals("Project was not found or does not exist", JsonPath.read(json, "$.detail"),
                                      "Response message should indicate project not found");
                     });
    }

    @Test
    @Order(10)
    @DisplayName("It should assert that activity repository is not empty")
    void assertActivityRepositoryNotEmpty(@Autowired @NotNull ActivityRepository activityRepository) {
        assertNotNull(activityRepository, "Activity repository should not be null");
        assertFalse(activityRepository.count() <= 0, "Activity repository should not be empty");
    }

    @Test
    @Order(11)
    @DisplayName("It should delete the project successfully")
    void deleteProject() {
        mockMvcTester.delete().uri("/api/v1/projects/" + createdProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .hasStatus(HttpStatus.NO_CONTENT)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertTrue(JsonPath.read(json, "$.data") == null || JsonPath.read(json, "$.data") == "",
                                    "Response data should be empty for successful deletion");
                         assertEquals("Project deleted successfully",
                                      JsonPath.read(json, "$.message"),
                                      "Response message should indicate successful deletion");
                     });
    }
}