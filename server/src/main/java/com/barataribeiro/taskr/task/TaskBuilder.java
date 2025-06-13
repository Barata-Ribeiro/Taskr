package com.barataribeiro.taskr.task;

import com.barataribeiro.taskr.task.dtos.TaskDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class TaskBuilder {
    private final ModelMapper modelMapper;

    public TaskDTO toTaskDTO(Task task) {
        return modelMapper.map(task, TaskDTO.class);
    }
}
