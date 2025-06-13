package com.barataribeiro.taskr.utils;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class TestSetupUtil {
    public static String registerAndLoginDefaultUser(
            @NotNull UserRepository userRepository,
            @NotNull UserBuilder userBuilder,
            @NotNull MockMvcTester mockMvcTester) throws Exception {

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

        String[] accessToken = new String[1];
        mockMvcTester.post().uri("/api/v1/auth/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(loginBody))
                     .assertThat()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         accessToken[0] = JsonPath.read(jsonContent.getJson(), "$.data.accessToken");
                         assertNotNull(accessToken[0], "Access token should not be null");
                     });

        return accessToken[0];
    }
}
