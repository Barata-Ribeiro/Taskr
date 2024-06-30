package com.barataribeiro.taskr.builder;

import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.models.entities.Project;
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
public class ProjectMapper {
    private final ModelMapper modelMapper;

    public ProjectDTO toDTO(Project project) {
        return modelMapper.map(project, ProjectDTO.class);
    }

    public Project toEntity(ProjectDTO projectDTO) {
        return modelMapper.map(projectDTO, Project.class);
    }

    public List<ProjectDTO> toDTOList(@NotNull List<Project> projects) {
        return projects.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Project> toListEntity(@NotNull List<ProjectDTO> projectDTOS) {
        return projectDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
