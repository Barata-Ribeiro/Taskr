package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.activity.ActivityRepository;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.task.dtos.TaskRequestDTO;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class TaskControllerTest {
    private static final TaskRequestDTO taskRequestDTO = new TaskRequestDTO();
    private static String accessToken;
    private static ProjectDTO defaultProject;
    private static TaskDTO createdTask;
    private final MockMvcTester mockMvcTester;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester) throws Exception {
        userRepository.deleteAll();

        accessToken = TestSetupUtil
                .registerAndLoginDefaultUser(userRepository, userBuilder, mockMvcTester).getAccessToken();
        defaultProject = TestSetupUtil.createDefaultProject(mockMvcTester, accessToken).get();
        assertNotNull(accessToken, "Access token should not be null");
        assertNotNull(defaultProject, "Default project should not be null");
    }

    @AfterAll
    static void tearDown(@Autowired @NotNull UserRepository userRepository,
                         @Autowired @NotNull ActivityRepository activityRepository) {
        assertNotNull(activityRepository, "Activity repository should not be null");
        assertFalse(activityRepository.count() <= 0, "Activity repository should not be empty");

        userRepository.deleteAll();
        accessToken = null;
        createdTask = null;
    }

    @Test()
    @Order(1)
    @DisplayName("It should create a task successfully")
    void createTaskSuccessfully() throws Exception {
        String description = "This is a test task description. It should be detailed enough to understand the task.";
        final String dueDate = LocalDateTime.now().plusDays(30)
                                            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

        taskRequestDTO.setProjectId(defaultProject.getId());
        taskRequestDTO.setTitle("Test Task");
        taskRequestDTO.setDescription(description);
        taskRequestDTO.setDueDate(dueDate);
        taskRequestDTO.setStatus("TO_DO");
        taskRequestDTO.setPriority("HIGH");

        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

        mockMvcTester.post().uri("/api/v1/tasks")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(taskRequestDTO))
                     .assertThat()
                     .hasStatus(HttpStatus.CREATED)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertEquals(taskRequestDTO.getTitle(), JsonPath.read(json, "$.data.title"));
                         assertEquals(taskRequestDTO.getDescription(), JsonPath.read(json, "$.data.description"));
                         assertEquals(taskRequestDTO.getDueDate(), JsonPath.read(json, "$.data.dueDate"));
                         assertEquals(taskRequestDTO.getStatus(), JsonPath.read(json, "$.data.status"));
                         assertEquals(taskRequestDTO.getPriority(), JsonPath.read(json, "$.data.priority"));

                         createdTask = objectMapper.convertValue(JsonPath.read(json, "$.data"), TaskDTO.class);
                     });
    }
}