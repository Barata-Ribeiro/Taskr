package com.barataribeiro.taskr.config;

import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.Roles;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MainSeeder {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${api.security.seeder.admin.username}")
    private String ADMIN_USERNAME;

    @Value("${api.security.seeder.admin.displayName}")
    private String ADMIN_DISPLAY_NAME;

    @Value("${api.security.seeder.admin.firstName}")
    private String ADMIN_FIRST_NAME;

    @Value("${api.security.seeder.admin.lastName}")
    private String ADMIN_LAST_NAME;

    @Value("${api.security.seeder.admin.email}")
    private String ADMIN_EMAIL;

    @Value("${api.security.seeder.admin.password}")
    private String ADMIN_PASSWORD;

    @PostConstruct
    @Transactional
    public void seedAdmin() {
        if (!userRepository.existsByUsername(ADMIN_USERNAME)) {
            User admin = User.builder()
                    .username(ADMIN_USERNAME)
                    .displayName(ADMIN_DISPLAY_NAME)
                    .firstName(ADMIN_FIRST_NAME)
                    .lastName(ADMIN_LAST_NAME)
                    .email(ADMIN_EMAIL)
                    .password(passwordEncoder.encode(ADMIN_PASSWORD))
                    .role(Roles.SERVICE_ADMIN)
                    .build();

            userRepository.save(admin);

            System.out.println("Admin user created.");
            System.out.println("Admin: " + userMapper.toDTO(admin));
        }

        System.out.println("Admin user already exists.");
        User admin = userRepository.findByUsername(ADMIN_USERNAME)
                .orElseThrow(() -> new RuntimeException("Admin user not found and could not be created."));
        System.out.println("Admin: " + userMapper.toDTO(admin));

    }
}
