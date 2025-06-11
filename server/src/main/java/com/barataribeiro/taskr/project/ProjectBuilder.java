package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProjectBuilder {
    private final ModelMapper modelMapper;

    public ProjectDTO toProjectDTO(Project project) {
        return modelMapper.map(project, ProjectDTO.class);
    }
}
