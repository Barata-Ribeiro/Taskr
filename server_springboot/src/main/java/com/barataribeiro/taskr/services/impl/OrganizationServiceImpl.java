package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.OrganizationMapper;
import com.barataribeiro.taskr.builder.ProjectMapper;
import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.organization.OrganizationDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationRequestDTO;
import com.barataribeiro.taskr.dtos.organization.UpdateOrganizationRequestDTO;
import com.barataribeiro.taskr.exceptions.organization.AlreadyCreatedOrganization;
import com.barataribeiro.taskr.exceptions.organization.OrganizationNotFound;
import com.barataribeiro.taskr.exceptions.organization.UserIsNotOwner;
import com.barataribeiro.taskr.exceptions.project.ProjectNotFound;
import com.barataribeiro.taskr.exceptions.user.UserNotFound;
import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.Project;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.relations.OrganizationProject;
import com.barataribeiro.taskr.models.relations.OrganizationUser;
import com.barataribeiro.taskr.repositories.entities.OrganizationRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationProjectRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
import com.barataribeiro.taskr.services.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class OrganizationServiceImpl implements OrganizationService {
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationUserRepository organizationUserRepository;
    private final OrganizationProjectRepository organizationProjectRepository;
    private final UserMapper userMapper;
    private final OrganizationMapper organizationMapper;
    private final ProjectMapper projectMapper;

    @Override
    @Transactional
    public OrganizationDTO createOrganization(@NotNull OrganizationRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);

        hasUserAlreadyCreatedOrganization(user);

        Organization organization = Organization.builder()
                .name(body.name())
                .description(body.description())
                .build();
        organization.incrementMembersCount();
        organizationRepository.save(organization);

        OrganizationUser relation = OrganizationUser.builder()
                .organization(organization)
                .user(user)
                .isAdmin(true)
                .isOwner(true)
                .build();
        organizationUserRepository.save(relation);

        return organizationMapper.toDTO(organization);
    }

    @Override
    public OrganizationDTO getOrganizationInfo(String id) {
        Organization organization = organizationRepository.findById(Integer.valueOf(id)).orElseThrow(OrganizationNotFound::new);
        return organizationMapper.toDTO(organization);
    }

    @Override
    @Transactional
    public Map<String, Object> getOrganizationMembers(String id) {
        Set<OrganizationUser> organizationUsers = organizationUserRepository
                .findAllByOrganization_Id(Integer.valueOf(id));

        if (organizationUsers.isEmpty()) {
            throw new OrganizationNotFound();
        }

        Organization organization = organizationUsers.stream()
                .findFirst()
                .map(OrganizationUser::getOrganization)
                .orElseThrow(OrganizationNotFound::new);

        User owner = organizationUsers.stream()
                .filter(OrganizationUser::isOwner)
                .findFirst()
                .map(OrganizationUser::getUser)
                .orElseThrow(UserNotFound::new);

        Set<User> admins = new HashSet<>();
        organizationUsers.stream()
                .filter(OrganizationUser::isAdmin)
                .forEach(entity -> admins.add(entity.getUser()));

        Set<User> members = new HashSet<>();
        organizationUsers.stream()
                .filter(entity -> !entity.isAdmin() && !entity.isOwner())
                .forEach(entity -> members.add(entity.getUser()));

        Map<String, Object> returnData = new HashMap<>();
        returnData.put("organization", organizationMapper.toDTO(organization));
        returnData.put("owner", userMapper.toDTO(owner));
        returnData.put("admins", userMapper.toDTOList(new ArrayList<>(admins)));
        returnData.put("members", userMapper.toDTOList(new ArrayList<>(members)));

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> getOrganizationProjects(String id) {
        Set<OrganizationProject> organizationProjects = organizationProjectRepository
                .findAllByOrganization_Id(Integer.valueOf(id));

        if (organizationProjects.isEmpty()) {
            throw new ProjectNotFound();
        }

        Organization organization = organizationProjects.stream()
                .findFirst()
                .map(OrganizationProject::getOrganization)
                .orElseThrow(OrganizationNotFound::new);

        Set<Project> projects = new HashSet<>();
        organizationProjects.forEach(entity -> projects.add(entity.getProject()));

        Map<String, Object> returnData = new HashMap<>();
        returnData.put("organization", organizationMapper.toDTO(organization));
        returnData.put("projects", projectMapper.toDTOList(new ArrayList<>(projects)));

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> updateOrganizationInfo(String id, UpdateOrganizationRequestDTO body,
                                                      @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(UserNotFound::new);

        if (!organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true)) {
            throw new UserIsNotOwner();
        }

        Organization organization = organizationRepository.findById(Integer.valueOf(id))
                .orElseThrow(OrganizationNotFound::new);

        if (body.name() != null) {
            organization.setName(body.name());
        }

        if (body.description() != null) {
            organization.setDescription(body.description());
        }
        
        organizationRepository.save(organization);

        List<String> usersNotAdded = new ArrayList<>();
        List<User> usersAdded = new ArrayList<>();

        if (body.usersToAdd() != null) {
            attemptAddUsersToOrganization(body, usersNotAdded, organization, usersAdded);
        }

        Map<String, Object> returnData = new HashMap<>();
        returnData.put("organization", organizationMapper.toDTO(organization));
        returnData.put("usersAdded", userMapper.toDTOList(usersAdded));
        returnData.put("usersNotAdded", usersNotAdded);

        return returnData;
    }

    @Override
    @Transactional
    public void deleteOrganization(String id, @NotNull Principal principal) {
        Organization organization = organizationRepository.findById(Integer.valueOf(id)).orElseThrow(OrganizationNotFound::new);
        OrganizationUser relation = organizationUserRepository.findOrganizationByUser_UsernameAndIsOwner(organization.getId(), principal.getName(), true)
                .orElseThrow(UserIsNotOwner::new);

        organizationUserRepository.delete(relation);
        organizationRepository.delete(organization);
    }

    private void attemptAddUsersToOrganization(@NotNull UpdateOrganizationRequestDTO body, List<String> usersNotAdded,
                                               Organization organization, List<User> usersAdded) {
        for (String username : body.usersToAdd()) {
            userRepository.findByUsername(username)
                    .ifPresentOrElse(
                            userToAdd -> {
                                if (organizationUserRepository.existsByUser_Id(userToAdd.getId())) {
                                    usersNotAdded.add(username);
                                } else {
                                    OrganizationUser relation = OrganizationUser.builder()
                                            .organization(organization)
                                            .user(userToAdd)
                                            .isAdmin(false)
                                            .isOwner(false)
                                            .build();
                                    organizationUserRepository.save(relation);
                                    usersAdded.add(userToAdd);
                                }
                            },
                            () -> usersNotAdded.add(username)
                    );
        }
    }

    private void hasUserAlreadyCreatedOrganization(@NotNull User user) {
        if (organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true)) {
            throw new AlreadyCreatedOrganization();
        }
    }
}
