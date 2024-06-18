package com.barataribeiro.taskr.dtos.organization;

import java.io.Serializable;

public record UpdateOrganizationRequestDTO(String name,
                                           String description,
                                           String logoUrl,
                                           String websiteUrl,
                                           String location) implements Serializable {
}
