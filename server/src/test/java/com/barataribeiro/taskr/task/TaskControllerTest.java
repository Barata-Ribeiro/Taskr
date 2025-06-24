package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.activity.ActivityRepository;
import com.barataribeiro.taskr.notification.NotificationRepository;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.task.dtos.TaskRequestDTO;
import com.barataribeiro.taskr.task.dtos.TaskUpdateRequestDTO;
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
import org.springframework.web.bind.MethodArgumentNotValidException;

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
    @Autowired private TaskRepository taskRepository;

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
                         @Autowired @NotNull ActivityRepository activityRepository,
                         @Autowired @NotNull NotificationRepository notificationRepository) {
        assertNotNull(activityRepository, "Activity repository should not be null");
        assertNotNull(notificationRepository, "Notification repository should not be null");

        assertFalse(activityRepository.count() <= 0, "Activity repository should not be empty");
        assertFalse(notificationRepository.count() <= 0, "Notification repository should not be empty");

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
                                            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));

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

    @Test
    @Order(2)
    @DisplayName("It should retrieve a task by ID successfully")
    void getTaskByIdSuccessfully() {
        assertNotNull(createdTask, "Created task should not be null");

        mockMvcTester.get().uri("/api/v1/tasks/{taskId}/project/{projectId}",
                                createdTask.getId(), defaultProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus(HttpStatus.OK)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertEquals(createdTask.getTitle(), JsonPath.read(json, "$.data.title"));
                         assertEquals(createdTask.getDescription(), JsonPath.read(json, "$.data.description"));
                         assertEquals(createdTask.getDueDate(), JsonPath.read(json, "$.data.dueDate"));
                         assertEquals(createdTask.getStatus().name(), JsonPath.read(json, "$.data.status"));
                         assertEquals(createdTask.getPriority().name(), JsonPath.read(json, "$.data.priority"));
                     });
    }

    @Test
    @Order(3)
    @DisplayName("It should update a task successfully")
    void updateTaskSuccessfully() throws Exception {
        assertNotNull(createdTask, "Created task should not be null");

        String updatedDescription = "This is an updated test task description.";
        final String updatedDueDate = LocalDateTime.now().plusDays(15)
                                                   .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));

        TaskUpdateRequestDTO updateRequest = new TaskUpdateRequestDTO();
        updateRequest.setProjectId(defaultProject.getId());
        updateRequest.setTitle("Updated Test Task");
        updateRequest.setDescription(updatedDescription);
        updateRequest.setDueDate(updatedDueDate);
        updateRequest.setStatus("IN_PROGRESS");
        updateRequest.setPriority("MEDIUM");

        mockMvcTester.patch().uri("/api/v1/tasks/{taskId}", createdTask.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus(HttpStatus.OK)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertEquals(updateRequest.getTitle(), JsonPath.read(json, "$.data.title"));
                         assertEquals(updatedDescription, JsonPath.read(json, "$.data.description"));
                         assertEquals(updatedDueDate, JsonPath.read(json, "$.data.dueDate"));
                         assertEquals(updateRequest.getStatus(), JsonPath.read(json, "$.data.status"));
                         assertEquals(updateRequest.getPriority(), JsonPath.read(json, "$.data.priority"));
                     });
    }

    @Test
    @Order(4)
    @DisplayName("It should fail to update a task with invalid data")
    void updateTaskWithInvalidData() throws Exception {
        assertNotNull(createdTask, "Created task should not be null");

        TaskUpdateRequestDTO invalidUpdateRequest = new TaskUpdateRequestDTO();
        invalidUpdateRequest.setProjectId(defaultProject.getId());
        invalidUpdateRequest.setTitle("abc");
        invalidUpdateRequest.setDescription("Too short");
        invalidUpdateRequest.setDueDate("invalid-date-format");
        invalidUpdateRequest.setStatus("INVALID_STATUS");
        invalidUpdateRequest.setPriority("INVALID_PRIORITY");

        mockMvcTester.patch().uri("/api/v1/tasks/{taskId}", createdTask.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(invalidUpdateRequest))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(MethodArgumentNotValidException.class);
    }

    @Test
    @Order(5)
    @DisplayName("It should fail to delete a task with invalid ID")
    void deleteTaskWithInvalidId() {
        // TODO: Adjust delete endpoint to handle invalid task IDs because the current implementation uses a
        //  repository method that returns success even for non-existent IDs.
        mockMvcTester.delete().uri("/api/v1/tasks/{taskId}/project/{projectId}", -1, defaultProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.NOT_FOUND);
    }

    @Test
    @Order(6)
    @DisplayName("It should delete a task successfully")
    void deleteTaskSuccessfully() {
        assertNotNull(createdTask, "Created task should not be null");

        mockMvcTester.delete().uri("/api/v1/tasks/{taskId}/project/{projectId}",
                                   createdTask.getId(), defaultProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus2xxSuccessful().hasStatus(HttpStatus.NO_CONTENT);

        taskRepository.findByIdAndProject_Id(createdTask.getId(), defaultProject.getId())
                      .ifPresent(task -> fail("Task should have been deleted, but was found: " + task));
    }
}