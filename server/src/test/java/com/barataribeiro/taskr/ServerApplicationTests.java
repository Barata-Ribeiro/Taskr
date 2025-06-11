package com.barataribeiro.taskr;

import com.barataribeiro.taskr.authentication.AuthenticationController;
import com.barataribeiro.taskr.authentication.services.AuthenticationService;
import com.barataribeiro.taskr.authentication.services.TokenService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ServerApplicationTests {
    private final ServerApplication serverApplication;
    private final AuthenticationController authenticationController;
    private final AuthenticationService authenticationService;
    private final TokenService tokenService;

    @Test
    void contextLoads() {
        assertNotNull(serverApplication);

        assertNotNull(tokenService);
        assertNotNull(authenticationController);
        assertNotNull(authenticationService);
    }

}
