package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.ProjectMapper;
import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.exceptions.organization.OrganizationNotFound;
import com.barataribeiro.taskr.exceptions.user.UserIsNotOrganizationMember;
import com.barataribeiro.taskr.exceptions.user.UserNotFound;
import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.relations.OrganizationProject;
import com.barataribeiro.taskr.models.relations.ProjectUser;
import com.barataribeiro.taskr.repositories.entities.OrganizationRepository;
import com.barataribeiro.taskr.repositories.entities.ProjectRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationProjectRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectUserRepository;
import com.barataribeiro.taskr.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ProjectServiceImpl implements ProjectService {
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationUserRepository organizationUserRepository;
    private final OrganizationProjectRepository organizationProjectRepository;
    private final ProjectRepository projectRepository;
    private final ProjectUserRepository projectUserRepository;
    private final ProjectMapper projectMapper;


    @Override
    @Transactional
    public ProjectDTO createProject(String orgId, ProjectCreateRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);
        Organization organization = organizationRepository.findById(Integer.valueOf(orgId)).orElseThrow(OrganizationNotFound::new);

        if (!organizationUserRepository.existsByOrganization_IdAndUser_Id(organization.getId(), user.getId())) {
            throw new UserIsNotOrganizationMember();
        }

        Project newProject = projectRepository.save(Project.builder()
                                                            .name(body.name())
                                                            .description(body.description())
                                                            .build());

        organizationProjectRepository.save(OrganizationProject.builder()
                                                   .organization(organization)
                                                   .project(newProject)
                                                   .build());

        projectUserRepository.save(ProjectUser.builder()
                                           .project(newProject)
                                           .user(user)
                                           .isProjectManager(true)
                                           .build());

        organization.incrementProjectsCount();
        organizationRepository.save(organization);

        return projectMapper.toDTO(newProject);
    }

    @Override
    public ProjectDTO getProjectById(String orgId, String projectId) {
        return null;
    }

    @Override
    public Map<String, Object> getProjectMembers(String orgId, String projectId) {
        return Map.of();
    }

    @Override
    public Map<String, Object> getProjectTasks(String orgId, String projectId) {
        return Map.of();
    }

    @Override
    public ProjectDTO updateProject(String orgId, String projectId, Object body, Principal principal) {
        return null;
    }

    @Override
    public void deleteProject(String orgId, String projectId, Principal principal) {

    }
}
