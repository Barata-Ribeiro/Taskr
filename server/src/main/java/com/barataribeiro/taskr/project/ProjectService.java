package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.activity.Activity;
import com.barataribeiro.taskr.activity.ActivityBuilder;
import com.barataribeiro.taskr.activity.ActivityRepository;
import com.barataribeiro.taskr.activity.dtos.ActivityDTO;
import com.barataribeiro.taskr.activity.events.project.ProjectCreatedEvent;
import com.barataribeiro.taskr.activity.events.project.ProjectUpdateEvent;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.ForbiddenRequestException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.membership.Membership;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.notification.events.ProjectMembershipNotificationEvent;
import com.barataribeiro.taskr.project.dtos.ProjectCompleteDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import com.barataribeiro.taskr.project.dtos.ProjectUpdateRequestDTO;
import com.barataribeiro.taskr.project.enums.ProjectRole;
import com.barataribeiro.taskr.project.enums.ProjectStatus;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.utils.StringNormalizer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProjectService {
    private final UserRepository userRepository;
    private final ProjectBuilder projectBuilder;
    private final ProjectRepository projectRepository;
    private final MembershipRepository membershipRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final ActivityRepository activityRepository;
    private final ActivityBuilder activityBuilder;

    @Cacheable(value = "projects",
               key = "#authentication.name + '_' + #pageQueryParams.page + '_' + #pageQueryParams.perPage + '_' + " +
                       "#pageQueryParams.direction + '_' + #pageQueryParams.orderBy")
    @Transactional(readOnly = true)
    public Page<ProjectDTO> getMyProjects(@NotNull PageQueryParamsDTO pageQueryParams,
                                          @NotNull Authentication authentication) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());
        Page<Project> projects = projectRepository.findAllByOwner_Username(authentication.getName(), pageable);
        return projects.map(projectBuilder::toProjectDTO);
    }

    @Cacheable(value = "project", key = "#projectId + '_' + #authentication.name")
    @Transactional(readOnly = true)
    public ProjectCompleteDTO getProjectById(Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        return projectBuilder.toProjectCompleteDTO(project);
    }

    @Transactional(readOnly = true)
    public Page<ActivityDTO> getProjectActivities(Long projectId, PageQueryParamsDTO pageQueryParams,
                                                  @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());
        Page<Activity> activities = activityRepository.findAllByProject_Id(projectId, pageable);
        return activities.map(activityBuilder::toActivityDTO);
    }

    @Caching(evict = {
            @CacheEvict(value = "projects", key = "#authentication.name + '_*'"),
            @CacheEvict(value = "project", allEntries = true),
            @CacheEvict(value = "globalStats", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "userStats", allEntries = true)
    },
             put = @CachePut(value = "project", key = "#result.id + '_' + #authentication.name"))
    @Transactional
    public ProjectDTO createProject(@Valid @NotNull ProjectRequestDTO body,
                                    @NotNull Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime dateTime = LocalDateTime.parse(body.getDueDate(), formatter);

        Project project = Project.builder()
                                 .title(body.getTitle())
                                 .description(body.getDescription())
                                 .dueDate(dateTime)
                                 .owner(user)
                                 .build();

        Membership membership = Membership.builder()
                                          .user(user)
                                          .project(projectRepository.save(project))
                                          .role(ProjectRole.OWNER)
                                          .joinedAt(LocalDateTime.now())
                                          .build();

        membershipRepository.save(membership);

        eventPublisher.publishEvent(new ProjectCreatedEvent(this, project, authentication.getName()));

        return projectBuilder.toProjectDTO(projectRepository.saveAndFlush(project));
    }

    @Caching(evict = {
            @CacheEvict(value = "projects", key = "#authentication.name + '_*'"),
            @CacheEvict(value = "project", key = "#projectId + '_' + #authentication.name"),
            @CacheEvict(value = "globalStats", allEntries = true),
            @CacheEvict(value = "projectStats", key = "#projectId + '_' + #authentication.name"),
            @CacheEvict(value = "userStats", allEntries = true)
    },
             put = @CachePut(value = "project", key = "#projectId + '_' + #authentication.name"))
    @Transactional
    public ProjectCompleteDTO updateProject(Long projectId, @Valid ProjectUpdateRequestDTO body,
                                            @NotNull Authentication authentication) {
        Project project = projectRepository
                .findById(projectId).orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        if (!project.getOwner().getUsername().equals(authentication.getName())) {
            throw new ForbiddenRequestException();
        }

        List<String> updates = new ArrayList<>();

        Optional.ofNullable(body.getTitle()).ifPresent(title -> {
            project.setTitle(title);
            updates.add(String.format("changed the project title to '%s'.", title));
        });

        Optional.ofNullable(body.getDescription()).ifPresent(desc -> {
            project.setDescription(desc);
            updates.add("changed the project description.");
        });

        Optional.ofNullable(body.getDueDate()).ifPresent(dueDate -> {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime dateTime = LocalDateTime.parse(dueDate, formatter);

            if (dateTime.isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Due date cannot be in the past.");
            }

            if (dateTime.isEqual(project.getDueDate())) {
                throw new IllegalArgumentException("Due date must be different from the current one.");
            }

            project.setDueDate(dateTime);
            updates.add(String.format("changed the project due date to %s.",
                                      dateTime.format(DateTimeFormatter.ofPattern("d MMMM, yyyy HH:mm"))));
        });

        Optional.ofNullable(body.getStatus()).ifPresent(status -> {
            project.setStatus(ProjectStatus.valueOf(status));
            updates.add(String.format("changed the project status to '%s'.",
                                      StringNormalizer.formatStatus(status)));
        });

        Optional.ofNullable(body.getMembersToAdd())
                .ifPresent(membersToAdd -> membersToAdd.parallelStream().forEach(member -> {
                    if (membershipRepository.existsByUser_UsernameAndProject_Id(member, projectId)) {
                        return; // Skip if the user is already a member
                    }

                    User user = userRepository
                            .findByUsername(member)
                            .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

                    Membership membership = Membership.builder()
                                                      .user(user)
                                                      .project(project)
                                                      .role(ProjectRole.MEMBER)
                                                      .joinedAt(LocalDateTime.now())
                                                      .build();

                    updates.add(String.format("added '%s' to the project.", user.getUsername()));
                    String message = String.format("'%s' has added you to the project '%s'.",
                                                   authentication.getName(), project.getTitle());
                    eventPublisher
                            .publishEvent(new ProjectMembershipNotificationEvent(this, user, project.getTitle(),
                                                                                 message, authentication.getName()));
                    membershipRepository.save(membership);
                }));
        Optional.ofNullable(body.getMembersToRemove())
                .ifPresent(membersToRemove -> membersToRemove.parallelStream().forEach(member -> {
                    Membership membership = membershipRepository.findByUser_UsernameAndProject_Id(member, projectId)
                                                                .orElse(null);

                    if (membership == null) return; // Skip if the user is not a member

                    boolean isOwner = membership.getRole() == ProjectRole.OWNER;
                    boolean isRequestingUser = membership.getUser().getUsername()
                                                         .equals(authentication.getName());

                    if (isOwner || isRequestingUser) return; // Skip if the user is the owner or the requesting user

                    updates.add(String.format("removed '%s' from the project.", membership.getUser().getUsername()));
                    String message = String.format("'%s' has removed you from the project '%s'.",
                                                   authentication.getName(), project.getTitle());
                    eventPublisher
                            .publishEvent(new ProjectMembershipNotificationEvent(this, membership.getUser(),
                                                                                 project.getTitle(), message,
                                                                                 authentication.getName()));

                    membershipRepository.delete(membership);
                }));

        if (updates.isEmpty()) throw new IllegalArgumentException("At least one field must be updated.");

        updates.parallelStream().forEachOrdered(reason -> eventPublisher
                .publishEvent(new ProjectUpdateEvent(this, project, authentication.getName(), reason)));

        return projectBuilder.toProjectCompleteDTO(projectRepository.saveAndFlush(project));
    }

    @Caching(evict = {
            @CacheEvict(value = "projects", key = "#authentication.name + '_*'"),
            @CacheEvict(value = "project", key = "#projectId + '_' + #authentication.name"),
            @CacheEvict(value = "globalStats", allEntries = true),
            @CacheEvict(value = "projectStats", key = "#projectId + '_' + #authentication.name"),
            @CacheEvict(value = "userStats", allEntries = true)
    })
    @Transactional
    public void deleteProject(Long projectId, @NotNull Authentication authentication) {
        long wasDeleted = projectRepository.deleteByIdAndOwner_Username(projectId, authentication.getName());
        if (wasDeleted == 0) throw new IllegalRequestException("Project not found or you are not the owner.");
    }

    private @NotNull PageRequest getPageRequest(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        return PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));
    }
}
