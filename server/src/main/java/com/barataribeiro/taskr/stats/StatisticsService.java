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
import com.barataribeiro.taskr.task.TaskRepository;
import com.barataribeiro.taskr.task.enums.TaskStatus;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Transactional(readOnly = true)
    public GlobalStatsDTO getGlobalStats(@NotNull Authentication authentication) {
        if (authentication.getAuthorities().stream()
                          .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new ForbiddenRequestException();
        }

        long totalUsers = userRepository.count();
        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();
        long totalComments = commentRepository.count();
        long totalMemberships = membershipRepository.count();
        long totalActivities = activityRepository.count();
        return new GlobalStatsDTO(totalUsers, totalProjects, totalTasks, totalComments, totalMemberships,
                                  totalActivities);
    }

    @Transactional(readOnly = true)
    public ProjectStatsDTO getProjectStats(Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        long totalTasks = taskRepository.countByProject_Id(projectId);
        long tasksToDo = taskRepository.countByProject_IdAndStatus(projectId, TaskStatus.TO_DO);
        long tasksInProgress = taskRepository.countByProject_IdAndStatus(projectId, TaskStatus.IN_PROGRESS);
        long tasksDone = taskRepository.countByProject_IdAndStatus(projectId, TaskStatus.DONE);
        long totalComments = commentRepository.countDistinctByTask_Id(projectId);
        long totalMembers = membershipRepository.countByProject_Id(projectId);
        long totalActivities = activityRepository.countByProject_Id(projectId);
        return new ProjectStatsDTO(totalTasks, tasksToDo, tasksInProgress, tasksDone, totalComments, totalMembers,
                                   totalActivities);
    }

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


        long totalProjectsOwned = projectRepository.countByOwner_Id(uuid);
        long totalTasksAssigned = taskRepository.countByAssignees_Id(uuid);
        long totalCommentsMade = commentRepository.countDistinctByAuthor_Username(currentUser.getUsername());
        long totalMemberships = membershipRepository.countByUser_Id(uuid);
        return new UserStatsDTO(totalProjectsOwned, totalTasksAssigned, totalCommentsMade, totalMemberships);
    }
}
