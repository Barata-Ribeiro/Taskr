package com.barataribeiro.taskr.dtos.organization;

import java.io.Serializable;

public record ManagementRequestDTO(String[] usersToAdd,
                                   String[] usersToRemove) implements Serializable {
}
