package com.barataribeiro.taskr.features.user.dtos;

import com.barataribeiro.taskr.features.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * DTO for {@link User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserSearchDTO implements Serializable {
    private UUID id;
    private String username;
    private Instant createdAt;
}