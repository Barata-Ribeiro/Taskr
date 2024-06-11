package com.barataribeiro.taskr.dtos.organization;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record OrganizationRequestDTO(
        @NotNull @NotEmpty(message = "Organization name is required.") String name,
        String description) implements Serializable {
}
