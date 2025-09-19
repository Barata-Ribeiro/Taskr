package com.barataribeiro.taskr.features.project.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectUpdateRequestDTO implements Serializable {
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters.")
    private String title;

    private String description;

    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$",
             message = "dueDate must be in ISO-8601 format: yyyy-MM-dd'T'HH:mm[:ss]")
    private String dueDate;

    @Pattern(regexp = "^(NOT_STARTED|IN_PROGRESS|COMPLETED|ON_HOLD|CANCELLED)$",
             message = "status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED")
    private String status;

    private List<String> membersToAdd;

    private List<String> membersToRemove;
}
