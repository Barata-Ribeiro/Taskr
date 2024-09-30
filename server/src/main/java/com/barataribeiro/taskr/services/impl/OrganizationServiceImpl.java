package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.OrganizationMapper;
import com.barataribeiro.taskr.builder.ProjectMapper;
import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.organization.ManagementRequestDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationDTO;
import com.barataribeiro.taskr.dtos.organization.OrganizationRequestDTO;
import com.barataribeiro.taskr.dtos.organization.UpdateOrganizationRequestDTO;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.IllegalRequestException;
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
import com.barataribeiro.taskr.utils.AppConstants;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

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
        User user =
                userRepository.findByUsername(principal.getName())
                              .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

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
    public Map<String, Object> getAllOrganizations(int page, int perPage) {
        Pageable paging = PageRequest.of(page, perPage);

        if ((perPage < 0 || perPage > 15) || page < 0) {
            throw new IllegalRequestException(
                    "Invalid parameters. Page must be greater than or equal to 0 and perPage must be between 0 and 15");
        }

        Page<Organization> organizationPage = organizationRepository.findAllOrganizationsPageable(paging);

        List<OrganizationDTO> organizations = organizationPage.isEmpty() ? new ArrayList<>() :
                                              organizationMapper.toDTOList(organizationPage.getContent());

        Map<String, Object> returnData = new HashMap<>();
        returnData.put("organizations", organizations);
        returnData.put("currentPage", organizationPage.getNumber());
        returnData.put("totalItems", organizationPage.getTotalElements());
        returnData.put("totalPages", organizationPage.getTotalPages());

        return returnData;
    }

    @Override
    public Map<String, Object> getTopThreeOrganizations() {
        List<Organization> organizations = organizationRepository.findDistinctTop3ByOrderByCreatedAtDesc();
        return Map.of("organizations", organizations.isEmpty() ? new ArrayList<>() :
                                       organizationMapper.toDTOList(organizations));
    }

    @Override
    public OrganizationDTO getOrganizationInfo(String id) {
        Organization organization = organizationRepository
                .findById(Long.valueOf(id))
                .orElseThrow(() -> new EntityNotFoundException(Organization.class.getSimpleName()));
        return organizationMapper.toDTO(organization);
    }

    @Override
    @Transactional
    public Map<String, Object> getOrganizationMembers(String id) {
        Set<OrganizationUser> organizationUsers = organizationUserRepository
                .findAllByOrganization_Id(Long.valueOf(id));

        if (organizationUsers.isEmpty()) {
            throw new EntityNotFoundException(Organization.class.getSimpleName());
        }

        Organization organization = organizationUsers.stream()
                                                     .findFirst()
                                                     .map(OrganizationUser::getOrganization)
                                                     .orElseThrow(() -> new EntityNotFoundException(
                                                             Organization.class.getSimpleName()));

        User owner = organizationUsers.stream()
                                      .filter(OrganizationUser::isOwner)
                                      .findFirst()
                                      .map(OrganizationUser::getUser)
                                      .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Set<User> admins = organizationUsers.stream()
                                            .filter(OrganizationUser::isAdmin)
                                            .map(OrganizationUser::getUser)
                                            .collect(Collectors.toSet());

        Set<User> members = organizationUsers.stream()
                                             .filter(entity -> !entity.isAdmin() && !entity.isOwner())
                                             .map(OrganizationUser::getUser)
                                             .collect(Collectors.toSet());

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> returnData = objectMapper.convertValue(organizationMapper.toDTO(organization),
                                                                   new TypeReference<>() {});
        returnData.put("owner", userMapper.toDTO(owner));
        returnData.put("admins", userMapper.toDTOList(new ArrayList<>(admins)));
        returnData.put("members", userMapper.toDTOList(new ArrayList<>(members)));

        return Map.of(AppConstants.ORGANIZATION, returnData);
    }


    @Override
    @Transactional
    public Map<String, Object> getOrganizationProjects(String id) {
        Set<OrganizationProject> organizationProjects = organizationProjectRepository
                .findAllByOrganization_Id(Long.valueOf(id));

        if (organizationProjects.isEmpty()) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Organization organization = organizationProjects.stream()
                                                        .findFirst()
                                                        .map(OrganizationProject::getOrganization)
                                                        .orElseThrow(() -> new EntityNotFoundException(
                                                                Organization.class.getSimpleName()));

        Set<Project> projects = organizationProjects.stream()
                                                    .map(OrganizationProject::getProject)
                                                    .collect(Collectors.toSet());

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
        returnData.put("projects", projectMapper.toDTOList(new ArrayList<>(projects)));

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> manageOrganizationMembers(String orgId, ManagementRequestDTO body,
                                                         @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        if (!organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true)) {
            throw new IllegalRequestException("You are not the owner of this organization.");
        }

        Organization organization = organizationRepository
                .findById(Long.valueOf(orgId))
                .orElseThrow(() -> new EntityNotFoundException(Organization.class.getSimpleName()));

        List<String> usersNotAdded = new ArrayList<>();
        List<User> usersAdded = new ArrayList<>();
        List<String> usersNotRemoved = new ArrayList<>();
        List<User> usersRemoved = new ArrayList<>();

        if (body.usersToAdd() != null) attemptAddUsersToOrganization(body, usersNotAdded, organization, usersAdded);
        if (body.usersToRemove() != null)
            attemptRemoveUsersFromOrganization(body, usersNotRemoved, organization, usersRemoved);

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
        returnData.put("usersAdded", userMapper.toDTOList(usersAdded));
        returnData.put("usersNotAdded", usersNotAdded);
        returnData.put("usersRemoved", userMapper.toDTOList(usersRemoved));
        returnData.put("usersNotRemoved", usersNotRemoved);

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> updateOrganizationInfo(String id, UpdateOrganizationRequestDTO body,
                                                      @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        if (!organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true)) {
            throw new IllegalRequestException("You are not the owner of this organization.");
        }

        Organization organization = organizationRepository.findById(Long.valueOf(id))
                                                          .orElseThrow(() -> new EntityNotFoundException(
                                                                  Organization.class.getSimpleName()));

        if (body.name() != null) organization.setName(body.name());
        if (body.description() != null) organization.setDescription(body.description());
        if (body.logoUrl() != null) organization.setLogoUrl(body.logoUrl());
        if (body.websiteUrl() != null) organization.setWebsiteUrl(body.websiteUrl());
        if (body.location() != null) organization.setLocation(body.location());

        organizationRepository.save(organization);

        return Map.of(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
    }

    @Override
    @Transactional
    public void deleteOrganization(String id, @NotNull Principal principal) {
        Organization organization = organizationRepository
                .findById(Long.valueOf(id))
                .orElseThrow(() -> new EntityNotFoundException(Organization.class.getSimpleName()));
        OrganizationUser relation = organizationUserRepository
                .findOrganizationByUser_UsernameAndIsOwner(organization.getId(), principal.getName(), true)
                .orElseThrow(() -> new IllegalRequestException("You are not the owner of this organization."));

        organizationUserRepository.delete(relation);
        organizationRepository.delete(organization);
    }

    private void attemptAddUsersToOrganization(@NotNull ManagementRequestDTO body, List<String> usersNotAdded,
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

    private void attemptRemoveUsersFromOrganization(@NotNull ManagementRequestDTO body, List<String> usersNotRemoved,
                                                    Organization organization, List<User> usersRemoved) {
        for (String username : body.usersToRemove()) {
            userRepository.findByUsername(username)
                          .ifPresentOrElse(
                                  userToRemove -> {
                                      if (organizationUserRepository.existsByUser_Id(userToRemove.getId())) {
                                          OrganizationUser relation = organizationUserRepository
                                                  .findOrganizationByUser_UsernameAndIsOwner(organization.getId(),
                                                                                             username, false)
                                                  .orElseThrow(() -> new IllegalRequestException(
                                                          "User is not a member of this organization."));
                                          organizationUserRepository.delete(relation);
                                          usersRemoved.add(userToRemove);
                                      } else {
                                          usersNotRemoved.add(username);
                                      }
                                  },
                                  () -> usersNotRemoved.add(username)
                          );
        }
    }

    private void hasUserAlreadyCreatedOrganization(@NotNull User user) {
        if (organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true)) {
            throw new IllegalRequestException("You have already created an organization.");
        }
    }
}
