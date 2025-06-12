package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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
    private final UserBuilder userBuilder;
    private final UserRepository userRepository;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester) throws Exception {
        RegistrationRequestDTO body = new RegistrationRequestDTO();
        body.setUsername("projectuser");
        body.setEmail("projectuser@example.com");
        body.setPassword("Gqe9rvtO5Bl@ZkBP5mTu#4$Nw");
        body.setDisplayName("Project User");

        LoginRequestDTO loginBody = new LoginRequestDTO();
        loginBody.setUsernameOrEmail(body.getUsername());
        loginBody.setPassword(body.getPassword());

        userRepository.save(userBuilder.toUser(body));

        mockMvcTester.post().uri("/api/v1/auth/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(loginBody))
                     .assertThat()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         accessToken = JsonPath.read(jsonContent.getJson(), "$.data.accessToken");
                         assertNotNull(accessToken, "Access token should not be null");
                     });
    }

    @Test
    @Order(1)
    @DisplayName("Create a new project")
    void createProject() throws Exception {
        projectRequestDTO.setTitle("Test Project");
        projectRequestDTO.setDescription("This is a test project.");
        projectRequestDTO.setDueDate("2024-12-31T23:59:59");

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
    @DisplayName("Get all projects for the authenticated user")
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
    @DisplayName("Get project by ID")
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
}