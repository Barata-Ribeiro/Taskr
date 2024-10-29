package com.barataribeiro.taskr.services.impl;

import com.barataribeiro.taskr.builder.NotificationMapper;
import com.barataribeiro.taskr.builder.OrganizationMapper;
import com.barataribeiro.taskr.builder.ProjectMapper;
import com.barataribeiro.taskr.builder.UserMapper;
import com.barataribeiro.taskr.dtos.organization.*;
import com.barataribeiro.taskr.exceptions.generics.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.generics.IllegalRequestException;
import com.barataribeiro.taskr.models.embeddables.OrganizationUserId;
import com.barataribeiro.taskr.models.entities.Notification;
import com.barataribeiro.taskr.models.entities.Organization;
import com.barataribeiro.taskr.models.entities.User;
import com.barataribeiro.taskr.models.relations.OrganizationProject;
import com.barataribeiro.taskr.models.relations.OrganizationUser;
import com.barataribeiro.taskr.repositories.entities.NotificationRepository;
import com.barataribeiro.taskr.repositories.entities.OrganizationRepository;
import com.barataribeiro.taskr.repositories.entities.UserRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationProjectRepository;
import com.barataribeiro.taskr.repositories.relations.OrganizationUserRepository;
import com.barataribeiro.taskr.services.NotificationService;
import com.barataribeiro.taskr.services.OrganizationService;
import com.barataribeiro.taskr.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional
    public OrganizationDTO createOrganization(@NotNull OrganizationRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        log.atInfo().log("User {} is attempting to create an organization.", user.getUsername());

        hasUserAlreadyCreatedOrganization(user);

        log.atInfo().log("Creating organization with name {} and description {}.", body.name(), body.description());

        Organization organization = Organization.builder()
                                                .name(body.name())
                                                .description(body.description())
                                                .build();
        organization.incrementMembersCount();

        organization = organizationRepository.save(organization);

        OrganizationUserId organizationUserId = new OrganizationUserId(organization.getId(), user.getId());
        OrganizationUser relation = OrganizationUser.builder()
                                                    .id(organizationUserId)
                                                    .organization(organization)
                                                    .user(user)
                                                    .isAdmin(true)
                                                    .isOwner(true)
                                                    .build();
        organizationUserRepository.save(relation);

        return organizationMapper.toDTO(organization);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationDTO> getAllOrganizations(String search, int page, int perPage, @NotNull String direction,
                                                     String orderBy, Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(AppConstants.CREATED_AT) ? AppConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Organization> organizationPage;
        if (search != null && !search.isBlank()) {
            organizationPage = organizationRepository.findAllOrganizationsWithParamsPaginated(search, pageable);
        } else {
            organizationPage = organizationRepository.findAll(pageable);
        }

        List<OrganizationDTO> organizations = organizationMapper.toDTOList(organizationPage.getContent());

        return new PageImpl<>(organizations, pageable, organizationPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public Map<String, Object> getOrganizationMembers(String orgId, String search, int page, int perPage,
                                                      @NotNull String direction, String orderBy) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(AppConstants.CREATED_AT) ? AppConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, "user." + orderBy));

        Page<OrganizationUser> organizationUsers;
        if (search != null && !search.isBlank()) {
            organizationUsers = organizationUserRepository
                    .findAllUsersWithParamsPaginated(Long.valueOf(orgId), search, pageable);
        } else {
            organizationUsers = organizationUserRepository.findByOrganization_Id(Long.valueOf(orgId), pageable);
        }

        Organization organization = organizationUsers.stream()
                                                     .findFirst()
                                                     .map(OrganizationUser::getOrganization)
                                                     .orElseThrow(() -> new EntityNotFoundException(
                                                             Organization.class.getSimpleName()));

        Page<OrganizationMemberDTO> membersPage = organizationUsers
                .stream()
                .map(organizationUser -> OrganizationMemberDTO.builder()
                                                              .user(userMapper.toDTO(organizationUser.getUser()))
                                                              .roles(getRole(organizationUser))
                                                              .build())
                .collect(Collectors.collectingAndThen(Collectors.toList(), list -> new PageImpl<>(list, pageable,
                                                                                                  organizationUsers.getTotalElements())));
        Map<String, Object> returnData = new LinkedHashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
        returnData.put("members", membersPage);

        return returnData;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOrganizationProjects(String id, String search, int page, int perPage,
                                                       @NotNull String direction, String orderBy) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(AppConstants.CREATED_AT) ? AppConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, "project." + orderBy));

        Page<OrganizationProject> organizationProjects;
        if (search != null && !search.isBlank()) {
            organizationProjects = organizationProjectRepository
                    .findAllProjectsWithParamsPaginated(Long.valueOf(id), search, pageable);
        } else {
            organizationProjects = organizationProjectRepository.findByOrganization_Id(Long.valueOf(id), pageable);
        }

        Organization organization = organizationProjects.stream()
                                                        .findFirst()
                                                        .map(OrganizationProject::getOrganization)
                                                        .orElseThrow(() -> new EntityNotFoundException(
                                                                Organization.class.getSimpleName()));


        Page<OrganizationProjectDTO> projectsPage = organizationProjects
                .stream()
                .map(organizationProject -> OrganizationProjectDTO.builder()
                                                                  .project(projectMapper.toDTO(
                                                                          organizationProject.getProject()))
                                                                  .status(String.valueOf(
                                                                          organizationProject.getStatus()))
                                                                  .build())
                .collect(Collectors.collectingAndThen(Collectors.toList(), list -> new PageImpl<>(list, pageable,
                                                                                                  organizationProjects.getTotalElements())));

        Map<String, Object> returnData = new LinkedHashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
        returnData.put("projects", projectsPage);

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> manageOrganizationMembers(String orgId, ManagementRequestDTO body,
                                                         @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        log.atInfo().log("User {} is attempting to manage organization {} members.", user.getUsername(), orgId);

        if (!organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true)) {
            throw new IllegalRequestException(AppConstants.NOT_THE_OWNER_OF_THIS_ORGANIZATION);
        }

        Organization organization = organizationRepository.findById(Long.valueOf(orgId))
                                                          .orElseThrow(() -> new EntityNotFoundException(
                                                                  Organization.class.getSimpleName()));

        List<String> usersNotAdded = new ArrayList<>();
        List<User> usersAdded = new ArrayList<>();
        List<String> usersNotRemoved = new ArrayList<>();
        List<User> usersRemoved = new ArrayList<>();

        if (body.usersToAdd() != null) attemptAddUsersToOrganization(body, usersNotAdded, organization, usersAdded);
        if (body.usersToRemove() != null) attemptRemoveUsersFromOrganization(body, usersNotRemoved, organization,
                                                                             usersRemoved);

        organizationRepository.save(organization);

        Map<String, Object> returnData = new HashMap<>();
        returnData.put(AppConstants.ORGANIZATION, organizationMapper.toDTO(organization));
        returnData.put("usersAdded", userMapper.toDTOList(usersAdded));
        returnData.put("usersNotAdded", usersNotAdded);
        returnData.put("usersRemoved", userMapper.toDTOList(usersRemoved));
        returnData.put("usersNotRemoved", usersNotRemoved);

        if (!usersAdded.isEmpty()) sendNotificationForUsersAdded(usersAdded, organization, user);
        if (!usersRemoved.isEmpty()) sendNotificationForUsersRemoved(usersRemoved, organization, user);

        return returnData;
    }

    @Override
    @Transactional
    public Map<String, Object> updateOrganizationInfo(String id, @NotNull UpdateOrganizationRequestDTO body,
                                                      @NotNull Principal principal) {
        final Organization organization = getOrganizationIfUserIsOwner(id, principal);

        if (body.name() != null) organization.setName(body.name());
        if (body.description() != null) organization.setDescription(body.description());
        if (body.logoUrl() != null) organization.setLogoUrl(body.logoUrl());
        if (body.websiteUrl() != null) organization.setWebsiteUrl(body.websiteUrl());
        if (body.location() != null) organization.setLocation(body.location());

        return Map.of(AppConstants.ORGANIZATION,
                      organizationMapper.toDTO(organizationRepository.saveAndFlush(organization)));
    }

    @Override
    @Transactional
    public void deleteOrganization(String id, @NotNull Principal principal) {
        log.atInfo().log("User {} is attempting to delete organization {}.", principal.getName(), id);

        Organization organization = organizationRepository
                .findById(Long.valueOf(id))
                .orElseThrow(() -> new EntityNotFoundException(Organization.class.getSimpleName()));
        OrganizationUser relation = organizationUserRepository
                .findOrganizationByUser_UsernameAndIsOwner(organization.getId(), principal.getName(), true)
                .orElseThrow(() -> new IllegalRequestException(AppConstants.NOT_THE_OWNER_OF_THIS_ORGANIZATION));

        organizationUserRepository.delete(relation);
        organizationRepository.delete(organization);
    }

    private @NotNull List<String> getRole(@NotNull OrganizationUser organizationUser) {
        List<String> roles = new ArrayList<>();
        if (organizationUser.isAdmin()) roles.add("Admin");
        if (organizationUser.isOwner()) roles.add("Owner");
        if (roles.isEmpty()) roles.add("Employee");
        return roles;
    }

    private Organization getOrganizationIfUserIsOwner(String id, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        log.atInfo().log("User {} is attempting to update organization {}.", user.getUsername(), id);

        if (!organizationUserRepository.existsOrganizationWhereUserByIdIsOwner(user.getId(), true)) {
            log.atError().log("User {} attempted to update organization {} without being the owner.",
                              user.getUsername(), id);
            throw new IllegalRequestException(AppConstants.NOT_THE_OWNER_OF_THIS_ORGANIZATION);
        }

        return organizationRepository.findById(Long.valueOf(id))
                                     .orElseThrow(() -> new EntityNotFoundException(
                                             Organization.class.getSimpleName()));
    }

    private void sendNotificationForUsersRemoved(@NotNull List<User> usersRemoved, Organization organization,
                                                 User user) {
        for (User userRemoved : usersRemoved) {
            Notification notification = Notification.builder()
                                                    .title("Left Organization")
                                                    .message(String.format(
                                                            "You have been removed from the organization %s, by " +
                                                                    "its owner %s.", organization.getName(),
                                                            user.getUsername()))
                                                    .user(userRemoved)
                                                    .build();

            notificationRepository.save(notification);

            notificationService.sendNotificationThroughWebsocket(userRemoved.getUsername(),
                                                                 notificationMapper.toDTO(notification));
        }
    }

    private void sendNotificationForUsersAdded(@NotNull List<User> usersAdded, Organization organization, User user) {
        for (User userAdded : usersAdded) {
            Notification notification = Notification.builder()
                                                    .title("Joined Organization")
                                                    .message(String.format(
                                                            "You have been added to the organization %s, by its " +
                                                                    "owner %s.", organization.getName(),
                                                            user.getUsername()))
                                                    .user(userAdded)
                                                    .build();

            notificationRepository.save(notification);

            notificationService.sendNotificationThroughWebsocket(userAdded.getUsername(),
                                                                 notificationMapper.toDTO(notification));
        }
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
                                          organization.incrementMembersCount();
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
                                          organization.decrementMembersCount();
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
