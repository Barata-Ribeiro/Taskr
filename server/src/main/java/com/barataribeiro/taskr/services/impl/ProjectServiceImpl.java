package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.*;
import com.barataribeiro.taskr.dtos.organization.ManagementRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectCreateRequestDTO;
import com.barataribeiro.taskr.dtos.project.ProjectDTO;
import com.barataribeiro.taskr.dtos.project.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.dtos.task.CompleteTaskDTO;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.IllegalRequestException;
import com.barataribeiro.taskr.models.embeddables.OrganizationProjectId;
import com.barataribeiro.taskr.models.embeddables.ProjectUserId;
import com.barataribeiro.taskr.models.entities.*;
import com.barataribeiro.taskr.models.enums.ProjectStatus;
import com.barataribeiro.taskr.models.enums.TaskPriority;
import com.barataribeiro.taskr.models.relations.*;
import com.barataribeiro.taskr.repositories.entities.NotificationRepository;
import com.barataribeiro.taskr.repositories.entities.OrganizationRepository;
import com.barataribeiro.taskr.repositories.entities.ProjectRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationProjectRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
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

@Slf4j
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
    public Map<String, Object> getProjectInfo(String orgId, String projectId, @NotNull Principal principal) {
        OrganizationProject organizationProject = organizationProjectRepository
                .findByOrganization_IdAndProject_Id(Long.valueOf(orgId), Long.valueOf(projectId))
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        boolean isMember = organizationProject.getOrganization().getOrganizationUsers().stream()
                                              .anyMatch(ou -> ou
                                                      .getUser()
                                                      .getUsername()
                                                      .equalsIgnoreCase(principal.getName()));
        if (!isMember) {
            throw new IllegalRequestException("You are not a member of this organization.");
        }

        Organization organization = organizationProject.getOrganization();
        Map<String, Object> simplifiedOrgInfo = new LinkedHashMap<>();
        simplifiedOrgInfo.put("id", organization.getId());
        simplifiedOrgInfo.put("name", organization.getName());
        simplifiedOrgInfo.put("isOwner", organization.getOrganizationUsers().stream()
                                                     .filter(OrganizationUser::isOwner)
                                                     .anyMatch(ou -> ou
                                                             .getUser()
                                                             .getUsername()
                                                             .equalsIgnoreCase(principal.getName())));
        simplifiedOrgInfo.put("isAdmin", organization.getOrganizationUsers().stream()
                                                     .filter(OrganizationUser::isAdmin)
                                                     .anyMatch(ou -> ou
                                                             .getUser()
                                                             .getUsername()
                                                             .equalsIgnoreCase(principal.getName())));

        ProjectDTO projectDTO = projectMapper.toDTO(organizationProject.getProject());
        ProjectStatus projectStatus = organizationProject.getStatus();
        UserDTO projectManager = getProjectManagerFromOrganizationProjectPivotAsDTO(organizationProject);
        boolean isManager = projectManager.getUsername().equalsIgnoreCase(principal.getName());

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> projectMap = objectMapper.convertValue(projectDTO, new TypeReference<>() {});
        projectMap.put("status", projectStatus);
        projectMap.put(AppConstants.MANAGER, projectManager);
        projectMap.put("isManager", isManager);

        Map<String, Object> projectInfo = new LinkedHashMap<>();
        projectInfo.put(AppConstants.ORGANIZATION, simplifiedOrgInfo);
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
        projectMap.put(AppConstants.MANAGER, userMapper.toDTO(projectManager));
        projectMap.put("members", userMapper.toDTOList(new ArrayList<>(projectMembers)));

        Map<String, Object> returnData = new LinkedHashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
        returnData.put(AppConstants.PROJECT, projectMap);

        return returnData;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectTasks(String orgId, String projectId, Principal principal) {
        Project project = organizationProjectRepository
                .findByOrganization_IdAndProject_Id(Long.valueOf(orgId), Long.valueOf(projectId))
                .map(OrganizationProject::getProject)
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        Set<ProjectTask> projectTasks = project.getProjectTask();

        Set<Task> tasks = getTasksFromProjectTasks(projectTasks);
        Map<String, List<CompleteTaskDTO>> sortedTasks = sortTasksByPriority(tasks);

        Map<String, Object> returnData = new LinkedHashMap<>();
        returnData.put(AppConstants.PROJECT, projectMapper.toDTO(project));
        returnData.put("tasks", sortedTasks.isEmpty() ? Collections.emptyMap() : sortedTasks);

        return returnData;
    }

    @Override
    @Transactional
    public ProjectDTO updateProject(String orgId, String projectId, @NotNull ProjectUpdateRequestDTO body,
                                    @NotNull Principal principal) {
        if (body.name() == null && body.description() == null) {
            throw new IllegalRequestException("You must provide at least one field to update.");
        }

        Project project = getManagedProjectByUser(projectId, principal);

        Optional.ofNullable(body.name()).ifPresent(project::setName);
        Optional.ofNullable(body.description()).ifPresent(project::setDescription);
        Optional.ofNullable(body.deadline()).ifPresent(project::setDeadline);

        return projectMapper.toDTO(project);
    }

    @Override
    @Transactional
    public Map<String, Object> manageProjectMembers(String orgId, String projectId, @NotNull ManagementRequestDTO body,
                                                    @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        log.atInfo().log("User {} is attempting to manage project {} members.", user.getUsername(), projectId);

        verifyIfRequestingUserIsProjectManager(Long.valueOf(projectId), user.getId());

        Project project = projectRepository
                .findById(Long.valueOf(projectId))
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        List<String> usersNotAdded = new ArrayList<>();
        List<User> usersAdded = new ArrayList<>();
        List<String> usersNotRemoved = new ArrayList<>();
        List<User> usersRemoved = new ArrayList<>();

        Optional.ofNullable(body.usersToAdd())
                .ifPresent(users -> attemptAddUsersToProject(body, usersNotAdded, project, usersAdded));

        Optional.ofNullable(body.usersToRemove())
                .ifPresent(users -> attemptRemoveUsersToProject(body, usersNotRemoved, project, usersRemoved));

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.PROJECT, projectMapper.toDTO(projectRepository.save(project)));
        returnData.put("usersAdded", userMapper.toDTOList(usersAdded));
        returnData.put("usersNotAdded", usersNotAdded);
        returnData.put("usersRemoved", userMapper.toDTOList(usersRemoved));
        returnData.put("usersNotRemoved", usersNotRemoved);

        if (!usersAdded.isEmpty()) {
            sendNotificationForUsersAdded(principal, usersAdded, project);
        }

        if (!usersRemoved.isEmpty()) {
            sendNotificationForUsersRemoved(principal, usersAdded, project);
        }

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

        boolean isOrganizationOwnerOrAdmin = organizationUserRepository
                .existsByOrganizationIdAndUserIdAndIsAdminOrIsOwner(
                        organizationProject.getOrganization().getId(), Long.valueOf(user.getId()));

        if (!isOrganizationOwnerOrAdmin) {
            throw new IllegalRequestException("You are not an owner or admin of this organization.");
        }

        ProjectStatus projectStatus = status == null
                                      ? organizationProject.getStatus()
                                      : ProjectStatus.valueOf(status.toUpperCase());

        organizationProject.setStatus(projectStatus);
        organizationProjectRepository.save(organizationProject);

        Map<String, Object> returnData = new LinkedHashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organizationProject.getOrganization()));
        returnData.put(AppConstants.PROJECT, projectMapper.toDTO(organizationProject.getProject()));
        returnData.put("newStatus", projectStatus);
        returnData.put(AppConstants.MANAGER, userMapper.toDTO(user));

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

    private UserDTO getProjectManagerFromOrganizationProjectPivotAsDTO(
            @NotNull OrganizationProject organizationProject) {
        return organizationProject.getProject().getProjectUser().stream()
                                  .filter(ProjectUser::isProjectManager)
                                  .findFirst()
                                  .map(ProjectUser::getUser)
                                  .map(userMapper::toDTO)
                                  .orElseThrow(() -> new EntityNotFoundException(
                                          User.class.getSimpleName()));
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

    private void sendNotificationForUsersRemoved(@NotNull Principal principal, @NotNull List<User> usersRemoved,
                                                 Project project) {
        for (User userRemoved : usersRemoved) {
            Notification notification = Notification.builder()
                                                    .title("Removed from Project")
                                                    .message(String.format(
                                                            "You have been removed from the project %s, by its " +
                                                                    "manager %s.",
                                                            project.getName(), principal.getName()))
                                                    .user(userRemoved)
                                                    .build();
            notificationRepository.save(notification);

            notificationService.sendNotificationThroughWebsocket(userRemoved.getUsername(),
                                                                 notificationMapper.toDTO(notification));
        }
    }

    private @NotNull Map<String, List<CompleteTaskDTO>> sortTasksByPriority(Set<Task> tasks) {
        Map<String, List<CompleteTaskDTO>> sortedTasks = new LinkedHashMap<>();
        sortedTasks.put("lowPriority", filterTasksByPriority(tasks, TaskPriority.LOW));
        sortedTasks.put("mediumPriority", filterTasksByPriority(tasks, TaskPriority.MEDIUM));
        sortedTasks.put("highPriority", filterTasksByPriority(tasks, TaskPriority.HIGH));
        return sortedTasks;
    }

    private List<CompleteTaskDTO> filterTasksByPriority(@NotNull Set<Task> tasks, TaskPriority priority) {
        return tasks.stream()
                    .filter(task -> task.getPriority().equals(priority))
                    .map(task -> {
                        TaskDTO taskDTO = taskMapper.toDTO(task);
                        UserDTO userAssigned = task.getTaskUser().stream()
                                                   .filter(TaskUser::isAssigned)
                                                   .findFirst()
                                                   .map(taskUser -> userMapper.toDTO(taskUser.getUser()))
                                                   .orElseThrow(() -> new EntityNotFoundException(
                                                           User.class.getSimpleName()));
                        UserDTO userCreator = task.getTaskUser().stream()
                                                  .filter(TaskUser::isCreator)
                                                  .findFirst()
                                                  .map(taskUser -> userMapper.toDTO(taskUser.getUser()))
                                                  .orElseThrow(() -> new EntityNotFoundException(
                                                          User.class.getSimpleName()));

                        return CompleteTaskDTO.builder()
                                              .task(taskDTO)
                                              .userAssigned(userAssigned)
                                              .userCreator(userCreator)
                                              .build();
                    })
                    .toList();
    }

    private Set<Task> getTasksFromProjectTasks(@NotNull Set<ProjectTask> projectTasks) {
        return projectTasks.stream()
                           .map(ProjectTask::getTask)
                           .collect(Collectors.toSet());
    }

    private void attemptAddUsersToProject(@NotNull ManagementRequestDTO body, List<String> usersNotAdded,
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

    private void attemptRemoveUsersToProject(@NotNull ManagementRequestDTO body, List<String> usersNotRemoved,
                                             Project project, List<User> usersRemoved) {
        for (String username : body.usersToRemove()) {
            userRepository.findByUsername(username)
                          .ifPresentOrElse(user -> {
                              projectUserRepository.deleteById_ProjectIdAndId_UserId(project.getId(), user.getId());
                              project.decrementMembersCount();
                              usersRemoved.add(user);
                          }, () -> usersNotRemoved.add(username));
        }
    }

    private @NotNull Project getManagedProjectByUser(String projectId, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Project project = projectRepository
                .findById(Long.valueOf(projectId))
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        verifyIfRequestingUserIsProjectManager(project.getId(), user.getId());

        return project;
    }

    private void verifyIfRequestingUserIsProjectManager(Long projectId, String userId) {
        boolean isManager = projectUserRepository.existsProjectWhereUserByIdIsManager(projectId, userId, true);

        if (!isManager) {
            throw new IllegalRequestException("You are not a manager of this project.");
        }
    }
}
