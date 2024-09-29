package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.OrganizationMapper;
import com.barataribeiro.taskr.builder.ProjectMapper;
import com.barataribeiro.taskr.builder.TaskMapper;
import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.dtos.project.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.exceptions.organization.OrganizationNotFound;
import com.barataribeiro.taskr.exceptions.project.ProjectLimitReached;
import com.barataribeiro.taskr.exceptions.project.ProjectNotFound;
import com.barataribeiro.taskr.exceptions.task.TaskNotFound;
import com.barataribeiro.taskr.exceptions.user.UserIsNotManager;
import com.barataribeiro.taskr.exceptions.user.UserIsNotOrganizationMember;
import com.barataribeiro.taskr.exceptions.user.UserNotFound;
import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.Task;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.enums.ProjectStatus;
import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.relations.OrganizationProject;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import com.barataribeiro.taskr.models.relations.ProjectUser;
import com.barataribeiro.taskr.repositories.entities.OrganizationRepository;
import com.barataribeiro.taskr.repositories.entities.ProjectRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationProjectRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectTaskRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectUserRepository;
import com.barataribeiro.taskr.services.ProjectService;
import com.barataribeiro.taskr.utils.AppConstants;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ProjectServiceImpl implements ProjectService {
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationUserRepository organizationUserRepository;
    private final OrganizationProjectRepository organizationProjectRepository;
    private final ProjectRepository projectRepository;
    private final ProjectUserRepository projectUserRepository;
    private final OrganizationMapper organizationMapper;
    private final UserMapper userMapper;
    private final ProjectMapper projectMapper;
    private final TaskMapper taskMapper;
    private final ProjectTaskRepository projectTaskRepository;


    @Override
    @Transactional
    public ProjectDTO createProject(String orgId, @NotNull ProjectCreateRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);

        if (user.getManagedProjects() >= 15) {
            throw new ProjectLimitReached();
        }

        Organization organization = organizationRepository.findById(Long.valueOf(orgId)).orElseThrow(
                OrganizationNotFound::new);

        if (!organizationUserRepository.existsByOrganization_IdAndUser_Id(organization.getId(), user.getId())) {
            throw new UserIsNotOrganizationMember();
        }

        Project newProject = projectRepository.save(Project.builder()
                                                           .name(body.name())
                                                           .description(body.description())
                                                           .membersCount(1L)
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

        user.incrementManagedProjects();
        userRepository.save(user);
        organization.incrementProjectsCount();
        organizationRepository.save(organization);

        return projectMapper.toDTO(newProject);
    }

    @Override
    public Map<String, Object> getProjectInfo(String orgId, String projectId) {
        OrganizationProject organizationProject = organizationProjectRepository
                .findByOrganization_IdAndProject_Id(Long.valueOf(orgId), Long.valueOf(projectId))
                .orElseThrow(ProjectNotFound::new);

        ProjectDTO projectDTO = projectMapper.toDTO(organizationProject.getProject());
        ProjectStatus projectStatus = organizationProject.getStatus();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> projectMap = objectMapper.convertValue(projectDTO, new TypeReference<>() {});
        projectMap.put("status", projectStatus);

        Map<String, Object> projectInfo = new HashMap<>();
        projectInfo.put(AppConstants.ORGANIZATION, organizationProject.getOrganization());
        projectInfo.put(AppConstants.PROJECT, projectMap);

        return projectInfo;
    }

    @Override
    @Transactional
    public Map<String, Object> getProjectMembers(String orgId, String projectId) {
        Set<ProjectUser> projectUsers = projectUserRepository.findAllByProject_Id(Long.valueOf(projectId));

        if (projectUsers.isEmpty()) {
            throw new ProjectNotFound();
        }

        Project project = projectUsers.stream()
                                      .findFirst()
                                      .map(ProjectUser::getProject)
                                      .orElseThrow(ProjectNotFound::new);

        Organization organization = organizationProjectRepository
                .findByOrganization_IdAndProject_Id(Long.valueOf(orgId), Long.valueOf(projectId))
                .map(OrganizationProject::getOrganization)
                .orElseThrow(OrganizationNotFound::new);

        User projectManager = projectUsers.stream()
                                          .filter(ProjectUser::isProjectManager)
                                          .findFirst()
                                          .map(ProjectUser::getUser)
                                          .orElseThrow(UserNotFound::new);

        Set<User> projectMembers = projectUsers.stream()
                                               .filter(entity -> !entity.isProjectManager())
                                               .map(ProjectUser::getUser)
                                               .collect(Collectors.toSet());

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> projectMap = objectMapper.convertValue(projectMapper.toDTO(project),
                                                                   new TypeReference<>() {});
        projectMap.put("manager", userMapper.toDTO(projectManager));
        projectMap.put("members", userMapper.toDTOList(new ArrayList<>(projectMembers)));

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
        returnData.put(AppConstants.PROJECT, projectMap);

        return returnData;
    }


    @Override
    public Map<String, Object> getProjectTasks(String orgId, String projectId) {
        Set<ProjectTask> projectTasks = projectTaskRepository.findAllByProject_id(Long.valueOf(projectId));

        if (projectTasks.isEmpty()) {
            throw new TaskNotFound();
        }

        Project project = getProjectFromTasks(projectTasks);
        Set<Task> tasks = getTasksFromProjectTasks(projectTasks);
        Map<String, Object> sortedTasks = sortTasksByPriority(tasks);

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.PROJECT, projectMapper.toDTO(project));
        returnData.put("tasks", sortedTasks);

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> updateProject(String orgId, String projectId,
                                             @NotNull ProjectUpdateRequestDTO body, @NotNull Principal principal) {
        Project project = getManagedProjectByUser(projectId, principal);

        if (body.name() != null) {
            project.setName(body.name());
        }

        if (body.description() != null) {
            project.setDescription(body.description());
        }

        List<String> usersNotAdded = new ArrayList<>();
        List<User> usersAdded = new ArrayList<>();

        if (body.usersToAdd() != null) {
            attemptAddUsersToProject(body, usersNotAdded, project, usersAdded);
        }

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.PROJECT, projectMapper.toDTO(project));
        returnData.put("usersAdded", usersAdded);
        returnData.put("usersNotAdded", usersNotAdded);

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> changeProjectStatus(String orgId, String projectId, String status,
                                                   @NotNull Principal principal) {
        OrganizationProject organizationProject = organizationProjectRepository
                .findByOrganization_IdAndProject_Id(Long.valueOf(orgId), Long.valueOf(projectId))
                .orElseThrow(ProjectNotFound::new);

        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);

        boolean isManager = projectUserRepository.existsProjectWhereUserByIdIsManager(
                organizationProject.getProject().getId(), user.getId(), true);

        if (!isManager) {
            throw new UserIsNotManager();
        }

        ProjectStatus projectStatus = status == null ? organizationProject.getStatus() : ProjectStatus.valueOf(
                status.toUpperCase());

        organizationProject.setStatus(projectStatus);
        organizationProjectRepository.save(organizationProject);

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organizationProject.getOrganization()));
        returnData.put(AppConstants.PROJECT, projectMapper.toDTO(organizationProject.getProject()));
        returnData.put("newStatus", projectStatus);
        returnData.put("manager", userMapper.toDTO(user));

        return returnData;
    }

    @Override
    @Transactional
    public void deleteProject(String orgId, String projectId, Principal principal) {
        Project project = getManagedProjectByUser(projectId, principal);

        projectUserRepository.deleteByProject(project);
        organizationProjectRepository.deleteByProject(project);
        projectRepository.delete(project);
    }

    private @NotNull Map<String, Object> sortTasksByPriority(Set<Task> tasks) {
        Map<String, Object> sortedTasks = new HashMap<>();
        sortedTasks.put("lowPriority", filterTasksByPriority(tasks, TaskPriority.LOW));
        sortedTasks.put("mediumPriority", filterTasksByPriority(tasks, TaskPriority.MEDIUM));
        sortedTasks.put("highPriority", filterTasksByPriority(tasks, TaskPriority.HIGH));
        return sortedTasks;
    }

    private List<TaskDTO> filterTasksByPriority(@NotNull Set<Task> tasks, TaskPriority priority) {
        return tasks.stream()
                    .filter(task -> task.getPriority().equals(priority))
                    .map(taskMapper::toDTO)
                    .toList();
    }

    private Project getProjectFromTasks(@NotNull Set<ProjectTask> projectTasks) {
        return projectTasks.stream()
                           .findFirst()
                           .map(ProjectTask::getProject)
                           .orElseThrow(ProjectNotFound::new);
    }

    private Set<Task> getTasksFromProjectTasks(@NotNull Set<ProjectTask> projectTasks) {
        return projectTasks.stream()
                           .map(ProjectTask::getTask)
                           .collect(Collectors.toSet());
    }

    private void attemptAddUsersToProject(@NotNull ProjectUpdateRequestDTO body, List<String> usersNotAdded,
                                          Project project, List<User> usersAdded) {
        for (String username : body.usersToAdd()) {
            userRepository.findByUsername(username)
                          .ifPresentOrElse(user -> {
                              projectUserRepository.save(ProjectUser.builder()
                                                                    .project(project)
                                                                    .user(user)
                                                                    .isProjectManager(false)
                                                                    .build());
                              usersAdded.add(user);
                          }, () -> usersNotAdded.add(username));
        }
    }

    private @NotNull Project getManagedProjectByUser(String projectId, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);
        Project project = projectRepository.findById(Long.valueOf(projectId)).orElseThrow(ProjectNotFound::new);
        boolean isManager = projectUserRepository.existsProjectWhereUserByIdIsManager(project.getId(), user.getId(),
                                                                                      true);

        if (!isManager) {
            throw new UserIsNotManager();
        }

        return project;
    }
}
