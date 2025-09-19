package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.taskr.features.user.UserBuilder;
import com.barataribeiro.taskr.features.user.UserRepository;
import com.barataribeiro.taskr.features.user.dtos.UserUpdateRequestDTO;
import com.barataribeiro.taskr.utils.TestSetupUtil;
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

import java.util.LinkedHashMap;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {"spring.cache.type=none"})
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class UserControllerTest {
    private static final String DEFAULT_PASSWORD = "Gqe9rvtO5Bl@ZkBP5mTu#4$Nw";
    private static String accessToken;
    private final MockMvcTester mockMvcTester;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester) throws Exception {
        userRepository.deleteAll();

        accessToken = TestSetupUtil.registerAndLoginDefaultUser(userRepository, userBuilder, mockMvcTester)
                                   .getAccessToken();
    }

    @Test
    @Order(1)
    @DisplayName("It should retrieve account details successfully")
    void getAccountDetails() {
        mockMvcTester.get().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertNotNull(JsonPath.read(json, "$.data.id"), "ID should not be null");
                         assertNotNull(JsonPath.read(json, "$.data.username"), "Username should not be null");
                         assertNotNull(JsonPath.read(json, "$.data.email"), "Email should not be null");
                         assertNotNull(JsonPath.read(json, "$.data.role"), "Role should not be null");
                         assertNotNull(JsonPath.read(json, "$.data.displayName"), "Display name should not be null");
                         assertNull(JsonPath.read(json, "$.data.fullName"), "Full name should be null");
                         assertNull(JsonPath.read(json, "$.data.avatarUrl"), "Avatar URL should be null");
                         assertFalse((Boolean) JsonPath.read(json, "$.data.isPrivate"), "isPrivate should be false");
                         assertFalse((Boolean) JsonPath.read(json, "$.data.isVerified"), "isVerified should be false");
                         assertNotNull(JsonPath.read(json, "$.data.createdAt"), "createdAt should not be null");
                         assertNotNull(JsonPath.read(json, "$.data.updatedAt"), "updatedAt should not be null");

                         int totalCreatedProjects = JsonPath.read(json, "$.data.totalCreatedProjects");
                         int totalCommentsMade = JsonPath.read(json, "$.data.totalCommentsMade");
                         int readNotificationsCount = JsonPath.read(json, "$.data.readNotificationsCount");
                         int unreadNotificationsCount = JsonPath.read(json, "$.data.unreadNotificationsCount");

                         assertTrue(totalCreatedProjects >= 0,
                                    "totalCreatedProjects should be greater than or equal to 0");
                         assertTrue(totalCommentsMade >= 0, "totalCommentsMade should be greater than or equal to 0");
                         assertTrue(readNotificationsCount >= 0,
                                    "readNotificationsCount should be greater than or equal to 0");
                         assertTrue(unreadNotificationsCount >= 0,
                                    "unreadNotificationsCount should be greater than or equal to 0");
                     });
    }

    @Test
    @Order(2)
    @DisplayName("It should update account details successfully")
    void updateAccountDetails() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setDisplayName("Updated User");
        body.setFullName("Updated Full Name");
        body.setAvatarUrl("https://example.com/avatar.jpg");

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();

                         assertEquals(body.getDisplayName(), JsonPath.read(json, "$.data.displayName"),
                                      "Display name should be updated");
                         assertEquals(body.getFullName(), JsonPath.read(json, "$.data.fullName"),
                                      "Full name should be updated");
                         assertInstanceOf(LinkedHashMap.class, JsonPath.read(json, "$.data"), "Data should be a list");
                         assertEquals(body.getAvatarUrl(),
                                      JsonPath.read(json, "$.data.avatarUrl"), "Avatar URL should be updated");
                     });
    }

    @Test
    @Order(3)
    @DisplayName("It should update password successfully")
    void updatePasswordSuccessfully() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setCurrentPassword(DEFAULT_PASSWORD);
        body.setNewPassword("NewStrongPassword!123");

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertNotNull(JsonPath.read(json, "$.data"), "Data should not be null");
                     });
    }

    @Test
    @Order(4)
    @DisplayName("It should fail to update password with wrong current password")
    void updatePasswordWithWrongCurrentPassword() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setCurrentPassword("WrongPassword123!");
        body.setNewPassword("AnotherStrongPassword!456");

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.UNAUTHORIZED)
                     .failure().isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    @Order(5)
    @DisplayName("It should fail to update account details with existing username")
    void updateAccountDetailsWithExistingUsername() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setUsername("awesomenewuser");

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(IllegalRequestException.class);
    }

    @Test
    @Order(6)
    @DisplayName("It should fail to update account details with existing email")
    void updateAccountDetailsWithExistingEmail() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setEmail("awesomenewuser@example.com");

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(IllegalRequestException.class);
    }

    @Test
    @Order(7)
    @DisplayName("It should fail to update account details with invalid properties")
    void updateAccountDetailsWithInvalidProperties() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setDisplayName("A");
        body.setFullName("12345");
        body.setAvatarUrl("invalid-url");
        body.setNewPassword("short");
        body.setCurrentPassword(DEFAULT_PASSWORD);

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(MethodArgumentNotValidException.class);
    }

    @Test
    @Order(8)
    @DisplayName("It should delete account successfully")
    void deleteAccount() {
        mockMvcTester.delete().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .accept(MediaType.APPLICATION_JSON)
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         assertNotNull(JsonPath.read(json, "$.message"), "Message should not be null");
                         assertEquals("Account deleted successfully", JsonPath.read(json, "$.message"),
                                      "Message should match expected value");
                     });
    }
}