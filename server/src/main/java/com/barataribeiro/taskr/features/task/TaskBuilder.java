package com.barataribeiro.taskr.features.task;

import com.barataribeiro.taskr.features.task.dtos.TaskDTO;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class TaskBuilder {
    private final ModelMapper modelMapper;

    public TaskDTO toTaskDTO(Task task) {
        return modelMapper.map(task, TaskDTO.class);
    }

    public List<TaskDTO> toTaskDTOList(@NotNull List<Task> tasks) {
        return tasks.parallelStream()
                    .map(this::toTaskDTO)
                    .toList();
    }
}
