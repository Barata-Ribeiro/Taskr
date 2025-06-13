package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
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

import static org.junit.jupiter.api.Assertions.*;

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
    @DisplayName("Get logged-in user's account details")
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

}