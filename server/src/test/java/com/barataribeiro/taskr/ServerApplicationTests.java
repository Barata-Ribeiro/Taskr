package com.barataribeiro.taskr;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ServerApplicationTests {
    private final ServerApplication serverApplication;

    @Test
    void contextLoads() {
        assertThat(serverApplication).isNotNull();
    }

}
