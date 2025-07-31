package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.comment.dtos.CommentRequestDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.utils.TestSetupUtil;
import com.barataribeiro.taskr.utils.dtos.LoginReturnDTO;
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

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@SpringBootTest(properties = {"spring.cache.type=none"})
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class CommentControllerTest {
    private static final CommentRequestDTO commentRequestDTO = new CommentRequestDTO();

    private static String accessToken;
    private static String secondAccessToken;
    private static TaskDTO defaultTask;
    private static CommentDTO createdComment;

    private final MockMvcTester mockMvcTester;
    private final CommentRepository commentRepository;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester) throws Exception {
        userRepository.deleteAll();

        LoginReturnDTO tokens = TestSetupUtil.registerAndLoginDefaultUser(userRepository, userBuilder, mockMvcTester);
        accessToken = tokens.getAccessToken();
        secondAccessToken = tokens.getSecondAccessToken();

        ProjectDTO defaultProject = TestSetupUtil.createDefaultProject(mockMvcTester, accessToken).get();
        defaultTask = TestSetupUtil.createDefaultTask(mockMvcTester, accessToken, defaultProject).get();
    }

    @Test
    @Order(1)
    @DisplayName("It should create a comment successfully")
    void createComment() throws Exception {
        commentRequestDTO.setBody("This is a test comment");

        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

        mockMvcTester.post()
                     .uri("/api/v1/comments/task/{taskId}", defaultTask.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(commentRequestDTO))
                     .assertThat()
                     .hasStatus(HttpStatus.CREATED)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         Long commentId = ((Number) JsonPath.read(json, "$.data.id")).longValue();
                         assertNotNull(commentId, "Comment ID should not be null");

                         String body = JsonPath.read(json, "$.data.content");
                         assertEquals(commentRequestDTO.getBody(), body, "Comment body should match the request body");

                         createdComment = objectMapper.convertValue(JsonPath.read(json, "$.data"), CommentDTO.class);
                     });
    }

    @Test
    @Order(2)
    @DisplayName("It should reply to a comment successfully")
    void replyToComment() throws Exception {
        CommentRequestDTO replyRequest = new CommentRequestDTO();
        replyRequest.setBody("This is a reply to the comment");
        replyRequest.setParentId(createdComment.getId());

        mockMvcTester.post()
                     .uri("/api/v1/comments/task/{taskId}", defaultTask.getId())
                     .header("Authorization", "Bearer " + secondAccessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(replyRequest))
                     .assertThat()
                     .hasStatus(HttpStatus.CREATED)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         Long replyId = ((Number) JsonPath.read(json, "$.data.id")).longValue();
                         assertNotNull(replyId, "Reply ID should not be null");

                         String body = JsonPath.read(json, "$.data.content");
                         assertEquals(replyRequest.getBody(), body, "Reply body should match the request body");
                     });
    }

    @Test
    @Order(3)
    @DisplayName("It should get comments by task ID successfully")
    void getCommentsByTaskId() {
        mockMvcTester.get()
                     .uri("/api/v1/comments/task/{taskId}", defaultTask.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus(HttpStatus.OK)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertNotNull(JsonPath.read(json, "$.data"), "Comments data should not be null");
                         assertEquals(1, (Integer) JsonPath.read(json, "$.data.length()"),
                                      "There should be one comment");

                         // Assert children
                         assertEquals(1, (Integer) JsonPath.read(json, "$.data[0].children.length()"),
                                      "There should be one child comment");
                         String childContent = JsonPath.read(json, "$.data[0].children[0].content");
                         assertEquals("This is a reply to the comment", childContent,
                                      "Child comment content should match");
                     });
    }

    @Test
    @Order(4)
    @DisplayName("It should update a comment successfully")
    void updateComment() throws Exception {
        CommentRequestDTO updateRequest = new CommentRequestDTO();
        updateRequest.setBody("This is an updated comment");
        updateRequest.setParentId(null);

        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

        mockMvcTester.patch()
                     .uri("/api/v1/comments/{commentId}/task/{taskId}", createdComment.getId(), defaultTask.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(objectMapper.writeValueAsBytes(updateRequest))
                     .assertThat()
                     .hasStatus(HttpStatus.OK)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         String body = JsonPath.read(json, "$.data.content");

                         assertEquals(updateRequest.getBody(), body, "Updated comment body should match");

                         Boolean wasEdited = JsonPath.read(json, "$.data.wasEdited");
                         assertTrue(wasEdited, "Comment should be marked as edited");
                         assertEquals("Comment updated successfully", JsonPath.read(json, "$.message"),
                                      "Response message should indicate successful update");
                     });
    }

    @Test
    @Order(5)
    @DisplayName("It should delete a comment successfully and the children should be deleted as well")
    void deleteComment() {
        mockMvcTester.delete()
                     .uri("/api/v1/comments/{commentId}/task/{taskId}", createdComment.getId(), defaultTask.getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus(HttpStatus.NO_CONTENT)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertTrue(JsonPath.read(json, "$.data") == null || JsonPath.read(json, "$.data") == "",
                                    "Response data should be empty for successful deletion");
                         assertEquals("Comment deleted successfully",
                                      JsonPath.read(json, "$.message"),
                                      "Response message should indicate successful deletion");
                     });

        // Verify that the comment and its children are deleted
        assertEquals(0, commentRepository.count(), "Comment repository should be empty after deletion");
    }
}