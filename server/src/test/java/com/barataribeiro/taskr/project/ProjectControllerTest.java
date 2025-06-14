package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.utils.TestSetupUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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

        accessToken = TestSetupUtil.registerAndLoginDefaultUser(userRepository, userBuilder, mockMvcTester);
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
    @DisplayName("It should get a project by ID")
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