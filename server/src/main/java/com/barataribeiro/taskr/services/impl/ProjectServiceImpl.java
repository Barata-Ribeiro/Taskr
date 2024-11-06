package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.*;
import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.dtos.project.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.IllegalRequestException;
import com.barataribeiro.taskr.models.embeddables.OrganizationProjectId;
import com.barataribeiro.taskr.models.embeddables.ProjectUserId;
import com.barataribeiro.taskr.models.entities.*;
import com.barataribeiro.taskr.models.enums.ProjectStatus;
import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.relations.OrganizationProject;
import com.barataribeiro.taskr.models.relations.OrganizationUser;
import com.barataribeiro.taskr.models.relations.ProjectTask;
import com.barataribeiro.taskr.models.relations.ProjectUser;
import com.barataribeiro.taskr.repositories.entities.NotificationRepository;
import com.barataribeiro.taskr.repositories.entities.OrganizationRepository;
import com.barataribeiro.taskr.repositories.entities.ProjectRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationProjectRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectTaskRepository;
import com.barataribeiro.taskr.repositories.relations.ProjectUserRepository;
import com.barataribeiro.taskr.services.NotificationService;
import com.barataribeiro.taskr.services.ProjectService;
import com.barataribeiro.taskr.utils.AppConstants;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;


    @Override
    @Transactional
    public ProjectDTO createProject(String orgId, @NotNull ProjectCreateRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        if (user.getManagedProjects() >= 15) {
            throw new IllegalRequestException("You have reached the maximum number (15) of projects you can manage.");
        }

        Organization organization = organizationRepository
                .findById(Long.valueOf(orgId))
                .orElseThrow(() -> new EntityNotFoundException(Organization.class.getSimpleName()));

        if (!organizationUserRepository.existsByOrganization_IdAndUser_Id(organization.getId(), user.getId())) {
            throw new IllegalRequestException("You are not a member of this organization.");
        }

        Project newProject = projectRepository.save(Project.builder()
                                                           .name(body.name())
                                                           .description(body.description())
                                                           .deadline(body.deadline())
                                                           .membersCount(1L)
                                                           .build());

        OrganizationProjectId organizationProjectId = new OrganizationProjectId(organization.getId(),
                                                                                newProject.getId());
        organizationProjectRepository.save(OrganizationProject.builder()
                                                              .id(organizationProjectId)
                                                              .organization(organization)
                                                              .project(newProject)
                                                              .build());

        ProjectUserId projectUserId = new ProjectUserId(newProject.getId(), user.getId());
        projectUserRepository.save(ProjectUser.builder()
                                              .id(projectUserId)
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
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectsWhereUserIsMember(String orgId, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        OrganizationUser organizationUser = user.getOrganizationUsers().stream()
                                                .filter(ou -> ou.getOrganization()
                                                                .getId()
                                                                .equals(Long.valueOf(orgId)))
                                                .findFirst()
                                                .orElseThrow(() -> new IllegalRequestException(
                                                        "You are not a member of this organization or it does not " +
                                                                "exist."));

        Set<ProjectUser> userProjects = organizationUser.getOrganization().getOrganizationProjects().stream()
                                                        .flatMap(op -> op.getProject().getProjectUser().stream())
                                                        .filter(pu -> pu.getUser().getId().equals(user.getId()))
                                                        .collect(Collectors.toSet());

        List<Map<String, Object>> projects = userProjects.stream()
                                                         .map(pu -> {
                                                             Project project = pu.getProject();
                                                             Map<String, Object> projectMap = new HashMap<>();
                                                             projectMap.put(AppConstants.PROJECT,
                                                                            projectMapper.toDTO(project));
                                                             projectMap.put("status", getProjectStatus(orgId, project));
                                                             projectMap.put("isManager", pu.isProjectManager());
                                                             return projectMap;
                                                         })
                                                         .toList();

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organizationUser.getOrganization()));
        returnData.put("projects", projects.isEmpty() ? Collections.emptyList() : projects);

        return returnData;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectInfo(String orgId, String projectId) {
        OrganizationProject organizationProject = organizationProjectRepository
                .findByOrganization_IdAndProject_Id(Long.valueOf(orgId), Long.valueOf(projectId))
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        ProjectDTO projectDTO = projectMapper.toDTO(organizationProject.getProject());
        ProjectStatus projectStatus = organizationProject.getStatus();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> projectMap = objectMapper.convertValue(projectDTO, new TypeReference<>() {});
        projectMap.put("status", projectStatus);

        Map<String, Object> projectInfo = new HashMap<>();
        projectInfo.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organizationProject.getOrganization()));
        projectInfo.put(AppConstants.PROJECT, projectMap);

        return projectInfo;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectMembers(String orgId, String projectId) {
        Set<ProjectUser> projectUsers = projectUserRepository.findAllByProject_Id(Long.valueOf(projectId));

        if (projectUsers.isEmpty()) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Project project = projectUsers.stream()
                                      .findFirst()
                                      .map(ProjectUser::getProject)
                                      .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        Organization organization = organizationProjectRepository
                .findByOrganization_IdAndProject_Id(Long.valueOf(orgId), Long.valueOf(projectId))
                .map(OrganizationProject::getOrganization)
                .orElseThrow(() -> new EntityNotFoundException(Organization.class.getSimpleName()));

        User projectManager = projectUsers.stream()
                                          .filter(ProjectUser::isProjectManager)
                                          .findFirst()
                                          .map(ProjectUser::getUser)
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

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
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectTasks(String orgId, String projectId) {
        Set<ProjectTask> projectTasks = projectTaskRepository.findAllByProject_id(Long.valueOf(projectId));

        if (projectTasks.isEmpty()) {
            throw new EntityNotFoundException(Task.class.getSimpleName());
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

            projectRepository.save(project);

            sendNotificationForUsersAdded(principal, usersAdded, project);
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
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        boolean isManager = projectUserRepository
                .existsProjectWhereUserByIdIsManager(organizationProject.getProject().getId(), user.getId(), true);

        if (!isManager) {
            throw new IllegalRequestException("You are not a manager of this project.");
        }

        ProjectStatus projectStatus = status == null
                                      ? organizationProject.getStatus()
                                      : ProjectStatus.valueOf(status.toUpperCase());

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

    private ProjectStatus getProjectStatus(String orgId, @NotNull Project project) {
        return project.getOrganizationProjects().stream()
                      .filter(op -> op.getOrganization().getId().equals(Long.valueOf(orgId)))
                      .findFirst()
                      .map(OrganizationProject::getStatus)
                      .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));
    }

    private void sendNotificationForUsersAdded(@NotNull Principal principal, @NotNull List<User> usersAdded,
                                               Project project) {
        for (User userAdded : usersAdded) {
            Notification notification = Notification.builder()
                                                    .title("Joined Project")
                                                    .message(String.format(
                                                            "You have been added to the project %s, by its " +
                                                                    "manager %s.",
                                                            project.getName(), principal.getName()))
                                                    .user(userAdded)
                                                    .build();
            notificationRepository.save(notification);

            notificationService.sendNotificationThroughWebsocket(userAdded.getUsername(),
                                                                 notificationMapper.toDTO(notification));
        }
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
                           .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));
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
                              project.incrementMembersCount();
                              usersAdded.add(user);
                          }, () -> usersNotAdded.add(username));
        }
    }

    private @NotNull Project getManagedProjectByUser(String projectId, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Project project = projectRepository
                .findById(Long.valueOf(projectId))
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        boolean isManager = projectUserRepository.existsProjectWhereUserByIdIsManager(project.getId(), user.getId(),
                                                                                      true);

        if (!isManager) {
            throw new IllegalRequestException("You are not a manager of this project.");
        }

        return project;
    }
}
