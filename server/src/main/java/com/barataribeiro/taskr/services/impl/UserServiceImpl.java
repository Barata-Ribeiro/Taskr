package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.TaskMapper;
import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.task.TaskDTO;
import com.barataribeiro.taskr.dtos.user.ContextDTO;
import com.barataribeiro.taskr.dtos.user.UpdateAccountRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.barataribeiro.taskr.exceptions.generics.EntityAlreadyExistsException;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.ForbiddenRequestException;
import com.barataribeiro.taskr.exceptions.generics.IllegalRequestException;
import com.barataribeiro.taskr.exceptions.users.InvalidAccountCredentialsException;
import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.relations.OrganizationUser;
import com.barataribeiro.taskr.models.relations.ProjectUser;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TaskMapper taskMapper;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserProfileById(String id) {
        User user = userRepository.findById(id)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        UserDTO userDTO = userMapper.toDTO(user);

        List<Map<String, Object>> organizations = user.getOrganizationUsers().stream()
                                                      .map(this::getSimpleOrganizationMap)
                                                      .toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("profile", userDTO);
        result.put("organizationsWhichUserIsMember", organizations);

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserContext(@NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        ContextDTO contextDTO = userMapper.toContextDTO(user);

        Set<ProjectUser> projectUsers = user.getProjectUser();
        List<Map<String, Object>> projects = projectUsers.stream()
                                                         .map(pu -> {
                                                             Project project = pu.getProject();
                                                             Map<String, Object> projectMap = new HashMap<>();
                                                             projectMap.put("id", project.getId());
                                                             projectMap.put("name", project.getName());
                                                             projectMap.put("isManager", pu.isProjectManager());
                                                             projectMap.put("organizationId", project
                                                                     .getOrganizationProjects()
                                                                     .iterator()
                                                                     .next()
                                                                     .getOrganization()
                                                                     .getId());
                                                             return projectMap;
                                                         })
                                                         .toList();
        projects = projects.isEmpty() ? null : projects;

        List<Map<String, Object>> organizations = getOrganizationsWhereUserIsMember(user);
        organizations = organizations.isEmpty() ? null : organizations;

        int totalProjects = (projects != null) ? projects.size() : 0;
        int totalOrganizations = (organizations != null) ? organizations.size() : 0;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("context", contextDTO);
        result.put("projectsWhereUserIsMember", projects);
        result.put("totalProjectsWhereUserIsMember", totalProjects);
        result.put("organizationsWhereUserIsMember", organizations);
        result.put("totalOrganizationsWhereUserIsMember", totalOrganizations);

        return result;
    }

    @Override
    @Transactional
    public ContextDTO updateUserProfile(String id, UpdateAccountRequestDTO body, @NotNull Principal principal) {
        if (body == null || isBodyOnlyContainingCurrentPassword(body)) {
            throw new IllegalRequestException("The request body must contain at least one field to update.");
        }

        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        validateUpdateRequest(id, body, user);

        setNewIncomingBodyPropertiesInExistingUserEntity(body, user);

        return userMapper.toContextDTO(userRepository.saveAndFlush(user));
    }

    @Override
    @Transactional
    public ContextDTO removeUserAvatar(String id, @NotNull Principal principal, String paramRemoveAvatar) {
        User user = userRepository.findById(id)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        if (!user.getUsername().equals(principal.getName())) {
            throw new ForbiddenRequestException();
        }

        if (paramRemoveAvatar == null || !paramRemoveAvatar.equals("true")) {
            throw new IllegalRequestException("The request parameter 'removeAvatar' must be set to 'true'.");
        }

        user.setAvatarUrl(null);

        return userMapper.toContextDTO(userRepository.saveAndFlush(user));
    }

    @Override
    @Transactional
    public void deleteUserProfile(String id, @NotNull Principal principal) {
        if (!userRepository.existsByIdAndUsername(id, principal.getName())) {
            throw new EntityNotFoundException(User.class.getSimpleName());
        }

        userRepository.deleteByIdAndUsername(id, principal.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getUserDashboard(@NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        ContextDTO contextDTO = userMapper.toContextDTO(user);

        // Organization related data
        final List<Map<String, Object>> organizations = getOrganizationsWhereUserIsMember(user);

        // Project related data
        Set<ProjectUser> projectUsers = user.getProjectUser();
        List<Map<String, Object>> projects = projectUsers.stream()
                                                         .map(pu -> {
                                                             Project project = pu.getProject();
                                                             Map<String, Object> projectMap = new HashMap<>();
                                                             projectMap.put("id", project.getId());
                                                             projectMap.put("name", project.getName());
                                                             projectMap.put("isManager", pu.isProjectManager());

                                                             // Task related data
                                                             List<TaskDTO> latestTasks =
                                                                     getProjectLatestTasksWhereUserIsEitherCreatorOrAssigned(
                                                                             project, user);
                                                             projectMap.put("latestTasks", latestTasks);

                                                             long totalTasks = project.getProjectTask().size();
                                                             projectMap.put("totalTasks", totalTasks);

                                                             return projectMap;
                                                         })
                                                         .toList();

        // Prepare the result map
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("context", contextDTO);
        result.put("organizationsWhereUserIsMember", organizations);
        result.put("projectsWhereUserIsMember", projects);

        return result;
    }

    private @NotNull Map<String, Object> getSimpleOrganizationMap(@NotNull OrganizationUser ou) {
        Organization organization = ou.getOrganization();
        Map<String, Object> orgMap = new HashMap<>();
        orgMap.put("id", organization.getId());
        orgMap.put("name", organization.getName());
        orgMap.put("isOwner", ou.isOwner());
        orgMap.put("isAdmin", ou.isAdmin());
        return orgMap;
    }

    private @NotNull List<Map<String, Object>> getOrganizationsWhereUserIsMember(@NotNull User user) {
        Set<OrganizationUser> organizationUsers = user.getOrganizationUsers();
        return organizationUsers.stream()
                                .map(this::getSimpleOrganizationMap)
                                .toList();
    }

    private List<TaskDTO> getProjectLatestTasksWhereUserIsEitherCreatorOrAssigned(@NotNull Project project, User user) {
        return project.getProjectTask().stream()
                      .flatMap(pt -> pt.getTask().getTaskUser().stream())
                      .filter(tu -> tu.getUser().equals(user) && (tu.isAssigned() || tu.isCreator()))
                      .sorted(Comparator.comparing(taskUser -> taskUser.getTask().getCreatedAt(),
                                                   Comparator.reverseOrder()))
                      .limit(5)
                      .map(tu -> taskMapper.toDTO(tu.getTask()))
                      .toList();
    }

    private void validateUpdateRequest(String id, UpdateAccountRequestDTO body, @NotNull User user) {
        if (!user.getId().equals(id)) {
            throw new ForbiddenRequestException();
        }

        if (!passwordEncoder.matches(body.currentPassword(), user.getPassword())) {
            throw new InvalidAccountCredentialsException("The provided credentials are invalid.");
        }

        if (body.username() != null && !body.username().isBlank() &&
                userRepository.existsByUsername(body.username()) && !user.getUsername().equals(body.username())) {
            throw new EntityAlreadyExistsException(User.class.getSimpleName());
        }
    }

    private boolean isBodyOnlyContainingCurrentPassword(@NotNull UpdateAccountRequestDTO body) {
        return (body.username() == null || body.username().isBlank()) &&
                (body.displayName() == null || body.displayName().isBlank()) &&
                (body.firstName() == null || body.firstName().isBlank()) &&
                (body.lastName() == null || body.lastName().isBlank()) &&
                (body.avatarUrl() == null || body.avatarUrl().isBlank()) &&
                (body.newPassword() == null || body.newPassword().isBlank());
    }

    private void setNewIncomingBodyPropertiesInExistingUserEntity(@NotNull UpdateAccountRequestDTO body, User user) {
        if (body.username() != null && !body.username().isBlank()) {
            String username = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
            user.setUsername(username);
        }

        if (body.displayName() != null && !body.displayName().isBlank()) {
            String displayName = StringEscapeUtils.escapeHtml4(body.displayName().strip());
            user.setDisplayName(displayName);
        }

        if (body.firstName() != null && !body.firstName().isBlank()) {
            user.setFirstName(body.firstName().strip());
        }

        if (body.lastName() != null && !body.lastName().isBlank()) {
            user.setLastName(body.lastName().strip());
        }

        if (body.avatarUrl() != null && !body.avatarUrl().isBlank()) {
            user.setAvatarUrl(body.avatarUrl().strip());
        }

        if (body.newPassword() != null && !body.newPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(body.newPassword()));
        }
    }
}
