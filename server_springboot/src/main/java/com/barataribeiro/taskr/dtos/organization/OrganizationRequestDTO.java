package com.barataribeiro.taskr.dtos.organization;

import java.io.Serializable;

public record OrganizationRequestDTO(String name, String description) implements Serializable {
}
