package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.activity.ActivityRepository;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.notification.NotificationRepository;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.task.dtos.*;
import com.barataribeiro.taskr.task.enums.TaskStatus;
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
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {"spring.cache.type=none"})
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class TaskControllerTest {
    private static final TaskRequestDTO taskRequestDTO = new TaskRequestDTO();
    private static String accessToken;
    private static String secondAccessToken;
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
        secondAccessToken = String
                .valueOf(TestSetupUtil.registerAndLoginNonAffiliatedUser(userRepository, userBuilder, mockMvcTester));
        defaultProject = TestSetupUtil.createDefaultProject(mockMvcTester, accessToken).get();

        assertNotNull(accessToken, "Access token should not be null");
        assertNotNull(secondAccessToken, "Second access token should not be null");
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
        final String dueDate = LocalDateTime.now().plusDays(15)
                                            .withNano(0)
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
        final String updatedDueDate = LocalDateTime.now().plusDays(30)
                                                   .withNano(0)
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
    @DisplayName("It should retrieve all tasks for a project grouped by status successfully")
    void getTasksByProjectSuccessfully() {
        mockMvcTester.get().uri("/api/v1/tasks/project/{projectId}", defaultProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus(HttpStatus.OK)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         List<?> toDo = JsonPath.read(json, "$.data.toDo");
                         List<?> inProgress = JsonPath.read(json, "$.data.inProgress");
                         List<?> done = JsonPath.read(json, "$.data.done");

                         assertNotNull(toDo);
                         assertNotNull(inProgress);
                         assertNotNull(done);

                         // Assert that to_do and done are empty
                         assertTrue(toDo.isEmpty(), "toDo list should be empty");
                         assertTrue(done.isEmpty(), "done list should be empty");

                         // Assert inProgress has exactly one task with expected values
                         assertEquals(1, inProgress.size(), "inProgress list should have one task");
                         Map<?, ?> task = (Map<?, ?>) inProgress.getFirst();
                         assertEquals("Updated Test Task", task.get("title"));
                         assertEquals("This is an updated test task description.", task.get("description"));
                         assertEquals("IN_PROGRESS", task.get("status"));
                         assertEquals("MEDIUM", task.get("priority"));
                         assertNotNull(task.get("assignees"));
                         List<?> assignees = (List<?>) task.get("assignees");
                         assertFalse(assignees.isEmpty(), "Assignees list should not be empty");
                     });
    }

    @Test
    @Order(6)
    @DisplayName("It should retrieve the latest tasks for a project successfully")
    void getLatestTasksByProjectSuccessfully() {
        mockMvcTester.get().uri("/api/v1/tasks/project/{projectId}/latest", defaultProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus(HttpStatus.OK)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         List<?> tasks = JsonPath.read(json, "$.data");
                         assertNotNull(tasks);
                         assertFalse(tasks.isEmpty(), "Latest tasks list should not be empty");

                         Map<?, ?> task = (Map<?, ?>) tasks.getFirst();
                         assertEquals("Updated Test Task", task.get("title"));
                         assertEquals("This is an updated test task description.", task.get("description"));
                         assertEquals("IN_PROGRESS", task.get("status"));
                         assertEquals("MEDIUM", task.get("priority"));
                         assertNotNull(task.get("assignees"));
                     });
    }

    @Test
    @Order(7)
    @DisplayName("It should fail to retrieve latest tasks for a project if user is not a member")
    void getLatestTasksByProjectUnauthorized() {
        mockMvcTester.get().uri("/api/v1/tasks/project/{projectId}/latest", defaultProject.getId())
                     .header("Authorization", "Bearer " + secondAccessToken)
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.NOT_FOUND)
                     .failure().isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    @Order(8)
    @DisplayName("It should fail to delete a task with invalid ID")
    void deleteTaskWithInvalidId() {
        mockMvcTester.delete().uri("/api/v1/tasks/{taskId}/project/{projectId}", -1, defaultProject.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(IllegalRequestException.class);
    }

    @Test
    @Order(9)
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

    @Test
    @Order(10)
    @DisplayName("It should reorder tasks within the same status successfully")
    void reorderTasksWithinStatusSuccessfully() throws Exception {
        TaskRequestDTO task1DTO = new TaskRequestDTO();
        task1DTO.setProjectId(defaultProject.getId());
        task1DTO.setTitle("Incredible Task 1");
        task1DTO.setDescription("Incredible Description 1");
        task1DTO.setDueDate(LocalDateTime.now().plusDays(1).withNano(0)
                                         .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        task1DTO.setStatus("TO_DO");
        task1DTO.setPriority("LOW");

        TaskRequestDTO task2DTO = new TaskRequestDTO();
        task2DTO.setProjectId(defaultProject.getId());
        task2DTO.setTitle("Incredible Task  2");
        task2DTO.setDescription("Incredible Description 2");
        task2DTO.setDueDate(LocalDateTime.now().plusDays(2).withNano(0)
                                         .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        task2DTO.setStatus("TO_DO");
        task2DTO.setPriority("LOW");

        Long task1Id = ((Number) JsonPath
                .read(mockMvcTester.post().uri("/api/v1/tasks")
                                   .header("Authorization", "Bearer " + accessToken)
                                   .contentType(MediaType.APPLICATION_JSON)
                                   .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(task1DTO))
                                   .exchange().getResponse().getContentAsString(), "$.data.id")).longValue();

        Long task2Id = ((Number) JsonPath
                .read(mockMvcTester.post().uri("/api/v1/tasks")
                                   .header("Authorization", "Bearer " + accessToken)
                                   .contentType(MediaType.APPLICATION_JSON)
                                   .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(task2DTO))
                                   .exchange().getResponse().getContentAsString(), "$.data.id")).longValue();

        List<Task> toDoTasks = taskRepository
                .findAllByProject_IdAndStatusOrderByPositionAsc(defaultProject.getId(), TaskStatus.TO_DO);
        assertEquals(2, toDoTasks.size(), "Should have two tasks in TO_DO");

        ReorderRequestDTO reorderDTO = new ReorderRequestDTO();
        reorderDTO.setStatus("TO_DO");
        reorderDTO.setTaskIds(List.of(task2Id, task1Id));

        List<?> newToDoTasks = JsonPath
                .read(mockMvcTester.patch().uri("/api/v1/tasks/project/{projectId}/reorder", defaultProject.getId())
                                   .header("Authorization", "Bearer " + accessToken)
                                   .contentType(MediaType.APPLICATION_JSON)
                                   .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(reorderDTO))
                                   .exchange().getResponse().getContentAsString(), "$.data.toDo");


        assertEquals(2, newToDoTasks.size(), "Should still have two tasks in TO_DO");
        Long newFirstId = ((Number) JsonPath.read(newToDoTasks.get(0), "id")).longValue();
        Long newSecondId = ((Number) JsonPath.read(newToDoTasks.get(1), "id")).longValue();
        assertEquals(task2Id, newFirstId, "First should be task2 after reorder");
        assertEquals(task1Id, newSecondId, "Second should be task1 after reorder");
    }

    @Test
    @Order(11)
    @DisplayName("It should move a task to a different status successfully")
    void moveTaskToDifferentStatusSuccessfully() throws Exception {
        TaskRequestDTO taskFDTO = new TaskRequestDTO();
        taskFDTO.setProjectId(defaultProject.getId());
        taskFDTO.setTitle("Task F");
        taskFDTO.setDescription("Description F");
        taskFDTO.setDueDate(LocalDateTime.now().plusDays(1).withNano(0)
                                         .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        taskFDTO.setStatus("TO_DO");
        taskFDTO.setPriority("LOW");
        Long taskFId = ((Number) JsonPath
                .read(mockMvcTester.post().uri("/api/v1/tasks")
                                   .header("Authorization", "Bearer " + accessToken)
                                   .contentType(MediaType.APPLICATION_JSON)
                                   .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(taskFDTO))
                                   .exchange().getResponse().getContentAsString(), "$.data.id")).longValue();

        TaskRequestDTO taskGDTO = new TaskRequestDTO();
        taskGDTO.setProjectId(defaultProject.getId());
        taskGDTO.setTitle("Task G");
        taskGDTO.setDescription("Description G");
        taskGDTO.setDueDate(LocalDateTime.now().plusDays(2).withNano(0)
                                         .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        taskGDTO.setStatus("IN_PROGRESS");
        taskGDTO.setPriority("LOW");
        Long taskGId = ((Number) JsonPath.read(
                mockMvcTester.post().uri("/api/v1/tasks")
                             .header("Authorization", "Bearer " + accessToken)
                             .contentType(MediaType.APPLICATION_JSON)
                             .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(taskGDTO))
                             .exchange().getResponse().getContentAsString(),
                "$.data.id")).longValue();

        TaskRequestDTO taskHDTO = new TaskRequestDTO();
        taskHDTO.setProjectId(defaultProject.getId());
        taskHDTO.setTitle("Task H");
        taskHDTO.setDescription("Description H");
        taskHDTO.setDueDate(LocalDateTime.now().plusDays(3).withNano(0)
                                         .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        taskHDTO.setStatus("IN_PROGRESS");
        taskHDTO.setPriority("LOW");
        Long taskHId = ((Number) JsonPath.read(
                mockMvcTester.post().uri("/api/v1/tasks")
                             .header("Authorization", "Bearer " + accessToken)
                             .contentType(MediaType.APPLICATION_JSON)
                             .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(taskHDTO))
                             .exchange().getResponse().getContentAsString(),
                "$.data.id")).longValue();

        String initialResponseJson = mockMvcTester
                .get().uri("/api/v1/tasks/project/{projectId}", defaultProject.getId())
                .header("Authorization", "Bearer " + accessToken)
                .exchange().getResponse().getContentAsString();

        List<?> inProgressTasks = JsonPath.read(initialResponseJson, "$.data.inProgress");
        assertEquals(2, inProgressTasks.size(), "Should have two tasks in IN_PROGRESS");

        MoveRequestDTO moveDTO = new MoveRequestDTO();
        moveDTO.setProjectId(defaultProject.getId());
        moveDTO.setNewStatus("IN_PROGRESS");
        moveDTO.setNewPosition(2);

        byte[] writeValueAsBytes = Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(moveDTO);

        String moveResponseJson = mockMvcTester.patch().uri("/api/v1/tasks/{taskId}/move", taskFId)
                                               .header("Authorization", "Bearer " + accessToken)
                                               .contentType(MediaType.APPLICATION_JSON)
                                               .content(writeValueAsBytes)
                                               .exchange().getResponse().getContentAsString();

        List<?> newInProgressTasks = JsonPath.read(moveResponseJson, "$.data.inProgress");
        assertEquals(3, newInProgressTasks.size(), "Should have three tasks in IN_PROGRESS after move");
        Long newFirstId = ((Number) JsonPath.read(newInProgressTasks.get(0), "id")).longValue();
        Long newSecondId = ((Number) JsonPath.read(newInProgressTasks.get(1), "id")).longValue();
        Long newThirdId = ((Number) JsonPath.read(newInProgressTasks.get(2), "id")).longValue();
        assertEquals(taskGId, newFirstId, "First should be G (position 1)");
        assertEquals(taskFId, newSecondId, "Second should be F (position 2)");
        assertEquals(taskHId, newThirdId, "Third should be H (position 3)");
    }
}