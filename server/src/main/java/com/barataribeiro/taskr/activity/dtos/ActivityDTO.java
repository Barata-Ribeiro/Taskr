package com.barataribeiro.taskr.activity.dtos;

import com.barataribeiro.taskr.activity.enums.ActivityType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.taskr.activity.Activity}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ActivityDTO implements Serializable {
    private Long id;
    private String username;
    private ActivityType action;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}