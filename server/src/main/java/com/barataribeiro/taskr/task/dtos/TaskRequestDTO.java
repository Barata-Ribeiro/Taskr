package com.barataribeiro.taskr.task.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskRequestDTO implements Serializable {
    @NotNull(message = "The project ID cannot be blank")
    private Long projectId;

    @NotBlank
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters.")
    private String title;

    @NotBlank
    @Size(min = 10, max = 255, message = "Summary must be between 10 and 255 characters.")
    private String summary;

    @NotBlank
    @Size(min = 10, message = "Description must be at least 10 characters long.")
    private String description;

    @NotBlank
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(:\\d{2})?$",
             message = "dueDate must be in ISO-8601 format: yyyy-MM-dd'T'HH:mm[:ss]")
    private String dueDate;

    @NotBlank
    @Pattern(regexp = "^(TO_DO|IN_PROGRESS|DONE)$", message = "Status must be one of: TO_DO, IN_PROGRESS, DONE")
    private String status;

    @NotBlank
    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|URGENT)$", message = "Priority must be one of: LOW, MEDIUM, HIGH and URGENT")
    private String priority;
}
