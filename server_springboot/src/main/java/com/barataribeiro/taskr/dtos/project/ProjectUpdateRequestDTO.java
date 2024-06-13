package com.barataribeiro.taskr.dtos.project;

import java.io.Serializable;

public record ProjectUpdateRequestDTO(String name,
                                      String description,
                                      String[] usersToAdd) implements Serializable {
}