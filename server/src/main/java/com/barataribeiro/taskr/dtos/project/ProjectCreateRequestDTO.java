package com.barataribeiro.taskr.dtos.project;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record ProjectCreateRequestDTO(@NotNull @NotEmpty(message = "Project name is required.") String name,
                                      @NotNull @NotEmpty(message = "Project description is required.") String description)
        implements Serializable {
}
