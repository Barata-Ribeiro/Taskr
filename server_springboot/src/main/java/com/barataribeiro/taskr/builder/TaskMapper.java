package com.barataribeiro.taskr.builder;

import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.models.entities.Task;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TaskMapper {
    private final ModelMapper modelMapper;

    public TaskDTO toDTO(Task task) {
        return modelMapper.map(task, TaskDTO.class);
    }

    public Task toEntity(TaskDTO taskDTO) {
        return modelMapper.map(taskDTO, Task.class);
    }

    public List<TaskDTO> toDTOList(@NotNull List<Task> tasks) {
        return tasks.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Task> toListEntity(@NotNull List<TaskDTO> taskDTOS) {
        return taskDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
