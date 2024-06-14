package com.barataribeiro.taskr.dtos.task;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record TaskCreateRequestDTO(@NotNull
                                   @NotEmpty(message = "Title is required") String title,

                                   @NotNull
                                   @NotEmpty(message = "Description is required") String description,

                                   String status,
                                   String priority,
                                   String dueDate) implements Serializable {
}
