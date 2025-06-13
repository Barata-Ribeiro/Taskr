package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.taskr.user.dtos.UserUpdateRequestDTO;
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

import java.util.LinkedHashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class UserControllerTest {
    private static String accessToken;

    private final MockMvcTester mockMvcTester;
    private final UserBuilder userBuilder;
    private final UserRepository userRepository;

    @BeforeAll
    static void setUp(@Autowired @NotNull UserRepository userRepository,
                      @Autowired @NotNull UserBuilder userBuilder,
                      @Autowired @NotNull MockMvcTester mockMvcTester) throws Exception {
        RegistrationRequestDTO body = new RegistrationRequestDTO();
        body.setUsername("newuser");
        body.setEmail("newuser@example.com");
        body.setPassword("Gqe9rvtO5Bl@ZkBP5mTu#4$Nw");
        body.setDisplayName("New User");

        RegistrationRequestDTO secondBody = new RegistrationRequestDTO();
        secondBody.setUsername("awesomenewuser");
        secondBody.setEmail("awesomenewuser@example.com");
        secondBody.setPassword("ovC1ZHL!&xE1ALbv*bdk$ANzN");
        secondBody.setDisplayName("Awesome New User");


        LoginRequestDTO loginBody = new LoginRequestDTO();
        loginBody.setUsernameOrEmail(body.getUsername());
        loginBody.setPassword(body.getPassword());

        userRepository.saveAll(List.of(userBuilder.toUser(body), userBuilder.toUser(secondBody)));

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
        body.setCurrentPassword("Gqe9rvtO5Bl@ZkBP5mTu#4$Nw");
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
    @DisplayName("It should fail to update account details with invalid password")
    void updateAccountDetailsWithInvalidPassword() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setCurrentPassword("WrongPassword123!");
        body.setDisplayName("Invalid Update");

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.UNAUTHORIZED)
                     .failure().isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    @Order(4)
    @DisplayName("It should fail to update account details with existing username")
    void updateAccountDetailsWithExistingUsername() throws Exception {
        UserUpdateRequestDTO body = new UserUpdateRequestDTO();
        body.setCurrentPassword("Gqe9rvtO5Bl@ZkBP5mTu#4$Nw");
        body.setUsername("awesomenewuser");

        mockMvcTester.patch().uri("/api/v1/users/me")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(body))
                     .assertThat()
                     .hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(IllegalRequestException.class);
    }
}