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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
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

    @Test
    @Order(3)
    @DisplayName("It should change the notification status successfully")
    void changeNotificationStatusSuccessfully() {
        mockMvcTester.patch().uri("/api/v1/notifications/{notifId}/status", notificationId)
                     .header("Authorization", "Bearer " + accessToken)
                     .param("isRead", "true")
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertEquals("Notification status updated successfully", JsonPath.read(json, "$.message"));
                         assertNotNull(JsonPath.read(json, "$.data"), "Updated notification data should not be null");
                         assertTrue((Boolean) JsonPath.read(json, "$.data.read"),
                                    "Notification should be marked as read");
                     });
    }

    @Test
    @Order(4)
    @DisplayName("It should change notification status in bulk successfully")
    void changeNotificationsStatusInBulkSuccessfully() throws Exception {
        User user = userRepository.findByUsername("newuser")
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Notification n1 = Notification
                .builder()
                .title("Bulk1")
                .message("Bulk1 msg")
                .type(NotificationType.INFO)
                .recipient(user)
                .isRead(false)
                .createdAt(Instant.now())
                .build();
        Notification n2 = Notification
                .builder()
                .title("Bulk2")
                .message("Bulk2 msg")
                .type(NotificationType.INFO)
                .recipient(user)
                .isRead(false)
                .createdAt(Instant.now())
                .build();
        n1 = notificationRepository.save(n1);
        n2 = notificationRepository.save(n2);
        List<Long> notifIds = List.of(n1.getId(), n2.getId());

        mockMvcTester.patch().uri("/api/v1/notifications/status")
                     .header("Authorization", "Bearer " + accessToken)
                     .param("isRead", "true")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(notifIds))
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         List<?> updated = JsonPath.read(json, "$.data");

                         assertEquals("Notifications status updated successfully", JsonPath.read(json, "$.message"));
                         assertEquals(2, updated.size());
                         assertTrue((Boolean) JsonPath.read(json, "$.data[0].read"));
                         assertTrue((Boolean) JsonPath.read(json, "$.data[1].read"));
                     });
    }

    @Test
    @Order(5)
    @DisplayName("It should delete notifications in bulk successfully")
    void deleteNotificationsInBulkSuccessfully() throws Exception {
        User user = userRepository.findByUsername("newuser")
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Notification n1 = Notification
                .builder()
                .title("DelBulk1")
                .message("DelBulk1 msg")
                .type(NotificationType.INFO)
                .recipient(user)
                .isRead(false)
                .createdAt(Instant.now())
                .build();
        Notification n2 = Notification
                .builder()
                .title("DelBulk2")
                .message("DelBulk2 msg")
                .type(NotificationType.INFO)
                .recipient(user)
                .isRead(false)
                .createdAt(Instant.now())
                .build();
        n1 = notificationRepository.save(n1);
        n2 = notificationRepository.save(n2);
        List<Long> notifIds = List.of(n1.getId(), n2.getId());

        Notification finalN = n1;
        Notification finalN1 = n2;

        mockMvcTester.delete().uri("/api/v1/notifications")
                     .header("Authorization", "Bearer " + accessToken)
                     .param("notifIds", notifIds.stream().map(String::valueOf).toArray(String[]::new))
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .hasStatus(HttpStatus.NO_CONTENT)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertNull(JsonPath.read(json, "$.data"));
                         assertEquals("Notifications deleted successfully", JsonPath.read(json, "$.message"));
                         assertFalse(notificationRepository.existsById(finalN.getId()),
                                     "Notification should be deleted from the repository");
                         assertFalse(notificationRepository.existsById(finalN1.getId()),
                                     "Notification should be deleted from the repository");
                     });
    }

    @Test
    @Order(6)
    @DisplayName("It should delete the notification successfully")
    void deleteNotificationSuccessfully() {
        mockMvcTester.delete().uri("/api/v1/notifications/{notifId}", notificationId)
                     .header("Authorization", "Bearer " + accessToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .hasStatus(HttpStatus.NO_CONTENT)
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertNull(JsonPath.read(json, "$.data"),
                                    "Response data should be null for successful deletion");
                         assertEquals("Notification deleted successfully", JsonPath.read(json, "$.message"),
                                      "Response message should indicate successful deletion");
                         assertFalse(notificationRepository.existsById(notificationId),
                                     "Notification should be deleted from the repository");
                     });
    }
}