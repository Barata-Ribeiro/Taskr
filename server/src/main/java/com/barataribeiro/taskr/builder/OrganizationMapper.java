package com.barataribeiro.taskr.builder;

import com.barataribeiro.taskr.dtos.organization.OrganizationDTO;
import com.barataribeiro.taskr.models.entities.Organization;
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
public class OrganizationMapper {
    private final ModelMapper modelMapper;

    public OrganizationDTO toDTO(Organization organization) {
        return modelMapper.map(organization, OrganizationDTO.class);
    }

    public Organization toEntity(OrganizationDTO organizationDTO) {
        return modelMapper.map(organizationDTO, Organization.class);
    }

    public List<OrganizationDTO> toDTOList(@NotNull List<Organization> organizations) {
        return organizations.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Organization> toListEntity(@NotNull List<OrganizationDTO> organizationDTOS) {
        return organizationDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
