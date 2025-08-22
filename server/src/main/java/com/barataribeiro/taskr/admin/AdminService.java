package com.barataribeiro.taskr.admin;

import com.barataribeiro.taskr.activity.ActivityRepository;
import com.barataribeiro.taskr.comment.Comment;
import com.barataribeiro.taskr.comment.CommentBuilder;
import com.barataribeiro.taskr.comment.CommentRepository;
import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.ProjectBuilder;
import com.barataribeiro.taskr.project.ProjectRepository;
import com.barataribeiro.taskr.project.dtos.ProjectCompleteDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.user.dtos.UserProfileDTO;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import com.barataribeiro.taskr.user.dtos.UserUpdateRequestDTO;
import com.barataribeiro.taskr.user.enums.Roles;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AdminService {

    private final UserRepository userRepository;
    private final UserBuilder userBuilder;
    private final ProjectRepository projectRepository;
    private final ProjectBuilder projectBuilder;
    private final CommentRepository commentRepository;
    private final CommentBuilder commentBuilder;
    private final ActivityRepository activityRepository;

    // Users

    @Transactional(readOnly = true)
    public Page<UserSecurityDTO> getAllUsers(@NotNull PageQueryParamsDTO pageQueryParams) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());
        Page<User> users = userRepository.findAll(pageable);
        return users.map(userBuilder::toUserSecurityDTO);
    }

    @Transactional(readOnly = true)
    public UserProfileDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        return userBuilder.toUserProfileDTO(user);
    }

    @Caching(evict = {
            @CacheEvict(value = {"userAccount", "publicUserProfile"}, key = "#username"),
            @CacheEvict(value = {"userMemberships", "globalStats", "userStats"}, allEntries = true)})
    @Transactional
    public UserProfileDTO toggleUserVerification(String username) {
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        user.setIsVerified(!user.getIsVerified());

        return userBuilder.toUserProfileDTO(userRepository.saveAndFlush(user));
    }

    @Caching(evict = {
            @CacheEvict(value = {"userAccount", "publicUserProfile"}, key = "#username"),
            @CacheEvict(value = {"userMemberships", "globalStats", "userStats"}, allEntries = true)})
    @Transactional
    public UserProfileDTO toggleUserBanStatus(String username, @NotNull Authentication authentication) {
        if (authentication.getName().equals(username)) {
            throw new IllegalArgumentException("You cannot ban yourself");
        }
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        user.setRole(user.getRole() == Roles.BANNED ? Roles.USER : Roles.BANNED);

        return userBuilder.toUserProfileDTO(userRepository.saveAndFlush(user));
    }

    @Caching(evict = {
            @CacheEvict(value = {"userAccount", "publicUserProfile"}, key = "#username"),
            @CacheEvict(value = {"userMemberships", "globalStats", "userStats"}, allEntries = true)})
    @Transactional
    public UserProfileDTO updateUserByUsername(String username, @NotNull Authentication authentication,
                                               @Valid UserUpdateRequestDTO body) {
        if (authentication.getName().equals(username)) {
            String message = "You cannot update your own account using this endpoint; Use regular user endpoint.";
            throw new IllegalArgumentException(message);
        }

        User userToUpdate = userRepository.findByUsername(username)
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        this.verifyIfBodyExistsThenUpdateProperties(body, userToUpdate);

        return userBuilder.toUserProfileDTO(userRepository.saveAndFlush(userToUpdate));
    }

    @Caching(evict = {
            @CacheEvict(value = {"userAccount", "publicUserProfile"}, key = "#username"),
            @CacheEvict(value = {"userMemberships", "globalStats", "userStats"}, allEntries = true)})
    @Transactional
    public void deleteUserByUsername(String username, @NotNull Authentication authentication) {
        if (authentication.getName().equals(username)) {
            final String msg = "Account deletion failed; Use regular user endpoint to delete your account.";
            throw new IllegalArgumentException(msg);
        }

        long wasDeleted = userRepository.deleteByUsername(authentication.getName());

        if (wasDeleted == 0) {
            throw new IllegalRequestException("Account deletion failed; Account not found or not authorized.");
        }
    }

    // Projects

    @Transactional(readOnly = true)
    public Page<ProjectDTO> getAllProjects(@NotNull PageQueryParamsDTO pageQueryParams) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());
        Page<Project> projects = projectRepository.findAll(pageable);
        return projects.map(projectBuilder::toProjectDTO);
    }

    @Transactional(readOnly = true)
    public ProjectCompleteDTO getProjectById(Long projectId) {
        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(Project.class.getSimpleName()));
        return projectBuilder.toProjectCompleteDTO(project);
    }

    @CacheEvict(
            value = {"userAccount", "publicUserProfile", "projects", "project", "projectActivities", "globalStats",
                     "projectStats", "userStats"}, allEntries = true)
    @Transactional
    public void deleteProjectById(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        projectRepository.deleteById(projectId);
        projectRepository.flush();
    }

    @CacheEvict(value = "commentsByTask", allEntries = true)
    @Transactional
    public CommentDTO softDeleteCommentById(Long commentId) {
        Comment comment = commentRepository
                .findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException(Comment.class.getSimpleName()));

        comment.setWasEdited(true);
        comment.setSoftDeleted(!comment.isSoftDeleted());

        return commentBuilder.toCommentDTO(commentRepository.saveAndFlush(comment));
    }

    private void verifyIfBodyExistsThenUpdateProperties(@NotNull UserUpdateRequestDTO body,
                                                        @NotNull User userToUpdate) {
        Optional.ofNullable(body.getUsername()).ifPresent(s -> {
            if (s.equals(userToUpdate.getUsername())) {
                throw new IllegalRequestException("Account already uses this username.");
            }

            if (userRepository.existsByUsernameOrEmailAllIgnoreCase(s, null)) {
                throw new IllegalRequestException("Username already in use.");
            }

            activityRepository.updateUsernameForAllActivities(userToUpdate.getUsername(), s);

            userToUpdate.setUsername(s);
        });

        Optional.ofNullable(body.getEmail()).ifPresent(s -> {
            if (s.equals(userToUpdate.getEmail())) {
                throw new IllegalRequestException("Account already uses this email.");
            }

            if (userRepository.existsByUsernameOrEmailAllIgnoreCase(null, s)) {
                throw new IllegalRequestException("Email already in use.");
            }

            userToUpdate.setEmail(s);
        });

        Optional.ofNullable(body.getBio()).ifPresent(userToUpdate::setBio);
        Optional.ofNullable(body.getDisplayName()).ifPresent(userToUpdate::setDisplayName);
        Optional.ofNullable(body.getFullName()).ifPresent(userToUpdate::setFullName);
        Optional.ofNullable(body.getAvatarUrl()).ifPresent(userToUpdate::setAvatarUrl);
        Optional.ofNullable(body.getCoverUrl()).ifPresent(userToUpdate::setCoverUrl);
        Optional.ofNullable(body.getPronouns()).ifPresent(userToUpdate::setPronouns);
        Optional.ofNullable(body.getLocation()).ifPresent(userToUpdate::setLocation);
        Optional.ofNullable(body.getWebsite()).ifPresent(userToUpdate::setWebsite);
        Optional.ofNullable(body.getCompany()).ifPresent(userToUpdate::setCompany);
        Optional.ofNullable(body.getJobTitle()).ifPresent(userToUpdate::setJobTitle);
    }

    private @NotNull PageRequest getPageRequest(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        return PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));
    }
}
