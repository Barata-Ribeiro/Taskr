package com.barataribeiro.taskr.authentication;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AuthenticationControllerTest {
    private static final RegistrationRequestDTO registrationRequestDTO = new RegistrationRequestDTO();

    private static String refreshToken;

    private final MockMvcTester mockMvcTester;
    private final UserRepository userRepository;

    @BeforeAll
    static void setUp() {
        registrationRequestDTO.setUsername("testuser");
        registrationRequestDTO.setEmail("testuser@example.com");
        registrationRequestDTO.setPassword("jPw7w3cN(6mnSKgeQMRX5$l5U");
        registrationRequestDTO.setDisplayName("Test User");
    }

    @Test
    @Order(1)
    @DisplayName("It should create a new user account")
    void createAccount() throws Exception {
        mockMvcTester.post().uri("/api/v1/auth/register")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(registrationRequestDTO))
                     .assertThat()
                     .hasStatus2xxSuccessful()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("Account created successfully",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertEquals(registrationRequestDTO.getUsername(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.username"));
                         assertEquals(registrationRequestDTO.getEmail(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.email"));
                     });
    }

    @Test
    @Order(2)
    @DisplayName("It should log in an existing user successfully")
    void loginUser() throws Exception {
        LoginRequestDTO loginRequestDTO = new LoginRequestDTO();
        loginRequestDTO.setUsernameOrEmail(registrationRequestDTO.getUsername());
        loginRequestDTO.setPassword(registrationRequestDTO.getPassword());

        mockMvcTester.post().uri("/api/v1/auth/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(loginRequestDTO))
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("Login successful", JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertEquals(registrationRequestDTO.getUsername(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.user.username"));
                         assertEquals(registrationRequestDTO.getEmail(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.user.email"));
                         refreshToken = JsonPath.read(jsonContent.getJson(), "$.data.refreshToken");
                     });
    }

    @Test
    @Order(3)
    @DisplayName("It should refresh the access token using the refresh token")
    void refreshToken() {
        mockMvcTester.post().uri("/api/v1/auth/refresh-token")
                     .header("X-Refresh-Token", refreshToken)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("Token refreshed successfully",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertEquals(registrationRequestDTO.getUsername(),
                                      JsonPath.read(jsonContent.getJson(), "$.data.user.username"));
                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data.accessToken"));
                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data.accessTokenExpiresAt"));
                     });
    }

    @Test
    @Order(4)
    @DisplayName("It should log out the user successfully, invalidating the refresh token")
    void logoutUser() {
        mockMvcTester.delete().uri("/api/v1/auth/logout")
                     .header("X-Refresh-Token", refreshToken)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> assertEquals("Logout successful",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));
    }

    @Test
    @DisplayName("It should not allow several registrations with the same username concurrently")
    void testConcurrentRegistration() {
        RegistrationRequestDTO concurrentRequest = new RegistrationRequestDTO();
        concurrentRequest.setUsername("concurrentuser");
        concurrentRequest.setEmail("concurrentuser@example.com");
        concurrentRequest.setPassword("WomZoQ4DoDnl20!stFvj$zk26");
        concurrentRequest.setDisplayName("Concurrent User");

        ConcurrencyTestUtil.doAsyncAndConcurrently(10, () -> mockMvcTester
                .post()
                .uri("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(concurrentRequest))
                .assertThat()
                .isNotNull());

        Long userCount = userRepository.countByUsername(concurrentRequest.getUsername());
        assertEquals(1, userCount, "User should be created only once");
    }
}