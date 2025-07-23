package com.barataribeiro.taskr;

import com.barataribeiro.taskr.authentication.AuthenticationController;
import com.barataribeiro.taskr.authentication.services.AuthenticationService;
import com.barataribeiro.taskr.authentication.services.TokenService;
import com.barataribeiro.taskr.notification.NotificationService;
import com.barataribeiro.taskr.project.ProjectController;
import com.barataribeiro.taskr.project.ProjectService;
import com.barataribeiro.taskr.task.TaskController;
import com.barataribeiro.taskr.task.TaskService;
import com.barataribeiro.taskr.user.UserController;
import com.barataribeiro.taskr.user.UserService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(properties = {"spring.cache.type=none"})
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ServerApplicationTests {
    private final ServerApplication serverApplication;
    private final AuthenticationController authenticationController;
    private final AuthenticationService authenticationService;
    private final TokenService tokenService;

    private final NotificationService notificationService;

    private final ProjectController projectController;
    private final ProjectService projectService;
    private final TaskController taskController;
    private final TaskService taskService;
    private final UserController userController;
    private final UserService userService;

    @Test
    void contextLoads() {
        assertNotNull(serverApplication);

        assertNotNull(tokenService);
        assertNotNull(authenticationController);
        assertNotNull(authenticationService);

        assertNotNull(notificationService);
        assertNotNull(projectController);
        assertNotNull(projectService);
        assertNotNull(taskController);
        assertNotNull(taskService);
        assertNotNull(userController);
        assertNotNull(userService);
    }

}
