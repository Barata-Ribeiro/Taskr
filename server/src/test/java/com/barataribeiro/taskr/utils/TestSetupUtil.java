package com.barataribeiro.taskr.utils;

import com.barataribeiro.taskr.authentication.dto.LoginRequestDTO;
import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import com.barataribeiro.taskr.project.dtos.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.task.dtos.TaskDTO;
import com.barataribeiro.taskr.task.dtos.TaskRequestDTO;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.utils.dtos.LoginReturnDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@Slf4j
public class TestSetupUtil {

    public static @NotNull LoginReturnDTO registerAndLoginDefaultUser(
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

        LoginRequestDTO secondLoginBody = new LoginRequestDTO();
        secondLoginBody.setUsernameOrEmail(secondBody.getUsername());
        secondLoginBody.setPassword(secondBody.getPassword());

        userRepository.saveAll(List.of(userBuilder.toUser(body), userBuilder.toUser(secondBody)));

        AtomicReference<String> accessToken = new AtomicReference<>();
        AtomicReference<String> secondAccessToken = new AtomicReference<>();

        mockMvcTester.post().uri("/api/v1/auth/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(loginBody))
                     .assertThat()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         accessToken.set(JsonPath.read(json, "$.data.accessToken"));
                         assertNotNull(accessToken.get(), "Access token should not be null");
                     });

        mockMvcTester.post().uri("/api/v1/auth/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(secondLoginBody))
                     .assertThat()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         secondAccessToken.set(JsonPath.read(json, "$.data.accessToken"));
                         assertNotNull(accessToken.get(), "Access token should not be null");
                     });

        return new LoginReturnDTO(accessToken.get(), secondAccessToken.get());
    }

    public static @NotNull AtomicReference<ProjectDTO> createDefaultProject(@NotNull MockMvcTester mockMvcTester,
                                                                            @NotNull String accessToken) throws Exception {
        ProjectRequestDTO projectRequestDTO = new ProjectRequestDTO();
        projectRequestDTO.setTitle("Test Project");
        projectRequestDTO.setDescription("This is a test project.");
        projectRequestDTO.setDueDate(LocalDateTime.now().plusDays(30)
                                                  .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));

        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

        AtomicReference<ProjectDTO> createdProject = new AtomicReference<>();

        mockMvcTester.post().uri("/api/v1/projects/create")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(projectRequestDTO))
                     .assertThat()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         createdProject.set(objectMapper.convertValue(JsonPath.read(json, "$.data"), ProjectDTO.class));
                         assertNotNull(createdProject.get(), "Created project should not be null");
                     });

        ProjectUpdateRequestDTO updateRequest = new ProjectUpdateRequestDTO();
        updateRequest.setMembersToAdd(List.of("awesomenewuser"));

        mockMvcTester.patch().uri("/api/v1/projects/{projectId}", createdProject.get().getId())
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(Jackson2ObjectMapperBuilder.json().build().writeValueAsBytes(updateRequest))
                     .assertThat()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         ProjectDTO updatedProject = objectMapper.convertValue(JsonPath.read(json, "$.data"),
                                                                               ProjectDTO.class);
                         assertNotNull(updatedProject, "Updated project should not be null");
                     });

        return createdProject;
    }

    public static @NotNull AtomicReference<TaskDTO> createDefaultTask(@NotNull MockMvcTester mockMvcTester,
                                                                      @NotNull String accessToken,
                                                                      @NotNull ProjectDTO project) throws Exception {
        TaskRequestDTO taskRequestDTO = new TaskRequestDTO();
        taskRequestDTO.setTitle("Test Task");
        taskRequestDTO.setDescription("This is a test task.");
        taskRequestDTO.setDueDate(LocalDateTime.now().plusDays(30)
                                               .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        taskRequestDTO.setStatus("TO_DO");
        taskRequestDTO.setPriority("HIGH");
        taskRequestDTO.setProjectId(project.getId());

        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder.json().build();

        AtomicReference<TaskDTO> createdTask = new AtomicReference<>();

        mockMvcTester.post().uri("/api/v1/tasks")
                     .header("Authorization", "Bearer " + accessToken)
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(objectMapper.writeValueAsBytes(taskRequestDTO))
                     .assertThat()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         String json = jsonContent.getJson();
                         createdTask.set(objectMapper.convertValue(JsonPath.read(json, "$.data"), TaskDTO.class));
                         assertNotNull(createdTask.get(), "Created task should not be null");
                     });

        return createdTask;
    }
}
