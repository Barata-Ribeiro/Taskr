package com.barataribeiro.taskr.features.project;

import com.barataribeiro.taskr.features.project.dtos.ProjectCompleteDTO;
import com.barataribeiro.taskr.features.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.features.project.dtos.ProjectSimpleDTO;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProjectBuilder {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void setupModelMapper() {
        modelMapper.addMappings(new PropertyMap<Project, ProjectCompleteDTO>() {
            @Override
            protected void configure() {
                using(ctx -> {
                    Set<?> totalTasks = (Set<?>) ctx.getSource();
                    return totalTasks == null ? 0L : totalTasks.size();
                }).map(source.getTasks(), destination.getTotalTasks());
            }
        });
    }

    public ProjectDTO toProjectDTO(Project project) {
        return modelMapper.map(project, ProjectDTO.class);
    }

    public ProjectCompleteDTO toProjectCompleteDTO(Project project) {
        return modelMapper.map(project, ProjectCompleteDTO.class);
    }

    public ProjectSimpleDTO toProjectSimpleDTO(Project project) {
        return modelMapper.map(project, ProjectSimpleDTO.class);
    }
}
