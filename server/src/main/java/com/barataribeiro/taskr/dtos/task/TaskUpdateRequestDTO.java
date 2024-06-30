package com.barataribeiro.taskr.dtos.task;

import java.io.Serializable;

public record TaskUpdateRequestDTO(String title,
                                   String description,
                                   String status,
                                   String priority,
                                   String startDate,
                                   String dueDate) implements Serializable {
}
