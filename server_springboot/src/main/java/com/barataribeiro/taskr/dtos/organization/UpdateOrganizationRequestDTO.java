package com.barataribeiro.taskr.dtos.organization;

import java.io.Serializable;

public record UpdateOrganizationRequestDTO(String name,
                                           String description,
                                           String[] usersToAdd) implements Serializable {
}
