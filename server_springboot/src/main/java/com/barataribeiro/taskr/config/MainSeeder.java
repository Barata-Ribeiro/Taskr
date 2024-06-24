package com.barataribeiro.taskr.config;

import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.Roles;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    Logger logger = LoggerFactory.getLogger(MainSeeder.class);
    @Value("${api.security.seeder.admin.username}")
    private String adminUsername;

    @Value("${api.security.seeder.admin.displayName}")
    private String adminDisplayName;

    @Value("${api.security.seeder.admin.firstName}")
    private String adminFirstName;

    @Value("${api.security.seeder.admin.lastName}")
    private String adminLastName;

    @Value("${api.security.seeder.admin.email}")
    private String adminEmail;

    @Value("${api.security.seeder.admin.password}")
    private String adminPassword;

    @PostConstruct
    @Transactional
    public void seedAdmin() {
        if (!userRepository.existsByUsername(adminUsername)) {
            User admin = User.builder()
                    .username(adminUsername)
                    .displayName(adminDisplayName)
                    .firstName(adminFirstName)
                    .lastName(adminLastName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Roles.SERVICE_ADMIN)
                    .build();

            userRepository.save(admin);

            logger.info("Admin user created.");
            logger.info("Admin: {}", userMapper.toDTO(admin));
        }

        logger.warn("Admin user already exists.");
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin user not found and could not be created."));
        logger.info("Admin: {}", userMapper.toDTO(admin));

    }
}
