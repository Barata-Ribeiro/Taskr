package com.barataribeiro.taskr.project;

import com.barataribeiro.taskr.activity.events.project.ProjectCreatedEvent;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.membership.Membership;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.project.dtos.ProjectCompleteDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.project.dtos.ProjectRequestDTO;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProjectService {
    private final UserRepository userRepository;
    private final ProjectBuilder projectBuilder;
    private final ProjectRepository projectRepository;
    private final MembershipRepository membershipRepository;
    private final ApplicationEventPublisher eventPublisher;

    public Page<ProjectDTO> getMyProjects(@NotNull PageQueryParamsDTO pageQueryParams,
                                          @NotNull Authentication authentication) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());
        Page<Project> projects = projectRepository.findAllByOwner_Username(authentication.getName(), pageable);
        return projects.map(projectBuilder::toProjectDTO);
    }

    @Transactional(readOnly = true)
    public ProjectCompleteDTO getProjectById(Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByProject_IdAndUser_Username(projectId, authentication.getName())) {
            throw new EntityNotFoundException("Project not found or you do not have access to it.");
        }

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));

        return projectBuilder.toProjectCompleteDTO(project);
    }

    @Transactional
    public ProjectDTO createProject(@Valid @NotNull ProjectRequestDTO body,
                                    @NotNull Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
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

        eventPublisher.publishEvent(new ProjectCreatedEvent(project, authentication.getName()));

        return projectBuilder.toProjectDTO(projectRepository.saveAndFlush(project));
    }

    private @NotNull PageRequest getPageRequest(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        return PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));
    }
}
