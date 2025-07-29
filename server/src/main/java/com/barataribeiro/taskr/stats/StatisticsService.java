package com.barataribeiro.taskr.stats;

import com.barataribeiro.taskr.activity.ActivityRepository;
import com.barataribeiro.taskr.comment.CommentRepository;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.ForbiddenRequestException;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.ProjectRepository;
import com.barataribeiro.taskr.stats.dtos.GlobalStatsDTO;
import com.barataribeiro.taskr.stats.dtos.ProjectStatsDTO;
import com.barataribeiro.taskr.stats.dtos.UserStatsDTO;
import com.barataribeiro.taskr.stats.dtos.counts.ProjectsCountDTO;
import com.barataribeiro.taskr.stats.dtos.counts.UserCountDTO;
import com.barataribeiro.taskr.task.TaskRepository;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
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
