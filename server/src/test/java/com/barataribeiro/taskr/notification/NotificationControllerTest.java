package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.notification.enums.NotificationType;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.utils.TestSetupUtil;
import com.barataribeiro.taskr.utils.dtos.LoginReturnDTO;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class NotificationControllerTest {
    private static String accessToken;
    private static Long notificationId;
    private final MockMvcTester mockMvcTester;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserBuilder userBuilder;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester,
                      @Autowired @NotNull NotificationRepository notificationRepository) throws Exception {
        userRepository.deleteAll();
        notificationRepository.deleteAll();

        LoginReturnDTO tokens = TestSetupUtil.registerAndLoginDefaultUser(userRepository, userBuilder, mockMvcTester);
        accessToken = tokens.getAccessToken();
        User user =
                userRepository.findByUsername("newuser")
                              .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Notification notification = Notification.builder()
                                                .title("Welcome")
                                                .message("Welcome to Taskr!")
                                                .type(NotificationType.INFO)
                                                .recipient(user)
                                                .isRead(false)
                                                .createdAt(Instant.now())
                                                .build();

        notificationId = notificationRepository.save(notification).getId();
    }

    @Test
    @Order(1)
    @DisplayName("It should retrieve the latest notifications successfully")
    void getLatestNotifications() {
        mockMvcTester.get().uri("/api/v1/notifications/latest")
                     .header("Authorization", "Bearer " + accessToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertEquals("Latest notification retrieved successfully", JsonPath.read(json, "$.message"));
                         assertNotNull(JsonPath.read(json, "$.data"), "Latest notification data should not be null");
                         assertEquals("Welcome", JsonPath.read(json, "$.data.latestNotifications[0].title"));
                         assertEquals("Welcome to Taskr!",
                                      JsonPath.read(json, "$.data.latestNotifications[0].message"));
                     });
    }

    @Test
    @Order(2)
    @DisplayName("It should retrieve all notifications paginated successfully")
    void getAllNotificationsPaginated() {
        mockMvcTester.get().uri("/api/v1/notifications")
                     .header("Authorization", "Bearer " + accessToken)
                     .param("page", "0")
                     .param("perPage", "10")
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertEquals("Notifications retrieved successfully", JsonPath.read(json, "$.message"));
                         assertNotNull(JsonPath.read(json, "$.data.content"),
                                       "Notifications content should not be null");
                         assertFalse(((List<?>) JsonPath.read(json, "$.data.content")).isEmpty(),
                                     "Should have at least one notification");
                     });
    }
}