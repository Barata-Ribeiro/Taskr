package com.barataribeiro.taskr.dtos.project;

import com.barataribeiro.taskr.utils.FutureDate;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;

public record ProjectCreateRequestDTO(@NotNull @NotEmpty(message = "Project name is required.")
                                      String name,

                                      @NotNull @NotEmpty(message = "Project description is required.")
                                      String description,

                                      @NotNull @NotEmpty(message = "Deadline is required.")
                                      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                                      @FutureDate(message = "Deadline must be a future date.")
                                      LocalDate deadline)
        implements Serializable {
}
