package com.barataribeiro.taskr.features.stats;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.ForbiddenRequestException;
import com.barataribeiro.taskr.features.activity.ActivityRepository;
import com.barataribeiro.taskr.features.comment.CommentRepository;
import com.barataribeiro.taskr.features.membership.MembershipRepository;
import com.barataribeiro.taskr.features.project.Project;
import com.barataribeiro.taskr.features.project.ProjectRepository;
import com.barataribeiro.taskr.features.stats.dtos.GlobalStatsDTO;
import com.barataribeiro.taskr.features.stats.dtos.ProjectStatsDTO;
import com.barataribeiro.taskr.features.stats.dtos.UserStatsDTO;
import com.barataribeiro.taskr.features.stats.dtos.counts.ProjectsCountDTO;
import com.barataribeiro.taskr.features.stats.dtos.counts.UserCountDTO;
import com.barataribeiro.taskr.features.task.TaskRepository;
import com.barataribeiro.taskr.features.user.User;
import com.barataribeiro.taskr.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StatisticsService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final MembershipRepository membershipRepository;
    private final ActivityRepository activityRepository;

    @Cacheable(value = "globalStats")
    @Transactional(readOnly = true)
    public GlobalStatsDTO getGlobalStats(@NotNull Authentication authentication) {
        if (authentication.getAuthorities().stream()
                          .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new ForbiddenRequestException();
        }

        UserCountDTO users = userRepository.getUserCount();
        ProjectsCountDTO projects = projectRepository.getProjectsCount();
        long totalTasks = taskRepository.count();
        long totalComments = commentRepository.count();
        long totalMemberships = membershipRepository.count();
        long totalActivities = activityRepository.count();
        return new GlobalStatsDTO(users, projects, totalTasks, totalComments, totalMemberships, totalActivities);
    }

    @Cacheable(value = "projectStats")
    @Transactional(readOnly = true)
    public ProjectStatsDTO getProjectStats(Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        return projectRepository.getProjectCount(projectId);
    }

    @Cacheable(value = "userStats")
    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats(String userId, @NotNull Authentication authentication) {
        UUID uuid = UUID.fromString(userId);

        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        User currentUser = userRepository.findById(uuid)
                                         .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        boolean isCurrentUser = currentUser.getUsername().equals(username);

        if (!isAdmin && !isCurrentUser) throw new ForbiddenRequestException();

        return userRepository.getUserStats(isCurrentUser ? currentUser.getId() : uuid);
    }
}
