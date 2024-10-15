package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.user.ContextDTO;
import com.barataribeiro.taskr.dtos.user.UpdateAccountRequestDTO;
import com.barataribeiro.taskr.dtos.user.UserDTO;
import com.barataribeiro.taskr.exceptions.generics.EntityAlreadyExistsException;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.ForbiddenRequestException;
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

    @Override
    public UserDTO getUserProfileById(String id) {
        User user = userRepository.findById(id)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        return userMapper.toDTO(user);
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
                                                             return projectMap;
                                                         })
                                                         .toList();
        projects = projects.isEmpty() ? null : projects;

        Set<OrganizationUser> organizationUsers = user.getOrganizationUsers();
        List<Map<String, Object>> organizations = organizationUsers.stream()
                                                                   .map(ou -> {
                                                                       Organization organization = ou.getOrganization();
                                                                       Map<String, Object> orgMap = new HashMap<>();
                                                                       orgMap.put("id", organization.getId());
                                                                       orgMap.put("name", organization.getName());
                                                                       return orgMap;
                                                                   })
                                                                   .toList();
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
    public UserDTO updateUserProfile(String id, UpdateAccountRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        if (!user.getId().equals(id)) {
            throw new ForbiddenRequestException();
        }

        if (!user.getPassword().equals(body.currentPassword())) {
            throw new InvalidAccountCredentialsException("The provided password is incorrect.");
        }

        if (userRepository.existsByUsername(body.username()) && !user.getUsername().equals(body.username())) {
            throw new EntityAlreadyExistsException(User.class.getSimpleName());
        }

        String username = StringEscapeUtils.escapeHtml4(body.username().toLowerCase().strip());
        String displayName = StringEscapeUtils.escapeHtml4(body.displayName().strip());

        user.setUsername(username);
        user.setDisplayName(displayName);
        user.setPassword(passwordEncoder.encode(body.newPassword()));

        User savedUser = userRepository.saveAndFlush(user);

        return userMapper.toDTO(savedUser);
    }

    @Override
    @Transactional
    public void deleteUserProfile(String id, @NotNull Principal principal) {
        if (!userRepository.existsByIdAndUsername(id, principal.getName())) {
            throw new EntityNotFoundException(User.class.getSimpleName());
        }

        userRepository.deleteByIdAndUsername(id, principal.getName());
    }
}
