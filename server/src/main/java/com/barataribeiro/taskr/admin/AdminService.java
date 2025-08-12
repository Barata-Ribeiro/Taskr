package com.barataribeiro.taskr.admin;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.project.ProjectBuilder;
import com.barataribeiro.taskr.project.ProjectRepository;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.UserRepository;
import com.barataribeiro.taskr.user.dtos.UserAccountDTO;
import com.barataribeiro.taskr.user.dtos.UserProfileDTO;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import com.barataribeiro.taskr.user.enums.Roles;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AdminService {

    private final UserRepository userRepository;
    private final UserBuilder userBuilder;
    private final ProjectRepository projectRepository;
    private final ProjectBuilder projectBuilder;

    @Transactional(readOnly = true)
    public Page<UserSecurityDTO> getAllUsers(@NotNull PageQueryParamsDTO pageQueryParams) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());
        Page<User> users = userRepository.findAll(pageable);
        return users.map(userBuilder::toUserSecurityDTO);
    }

    @Transactional(readOnly = true)
    public UserAccountDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        return userBuilder.toUserAccountDTO(user);
    }

    @Transactional
    public UserProfileDTO toggleUserVerification(String username) {
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        user.setIsVerified(!user.getIsVerified());

        return userBuilder.toUserProfileDTO(userRepository.saveAndFlush(user));
    }

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

    @Transactional(readOnly = true)
    public Page<ProjectDTO> getAllProjects(@NotNull PageQueryParamsDTO pageQueryParams) {
        final PageRequest pageable = getPageRequest(pageQueryParams.getPage(), pageQueryParams.getPerPage(),
                                                    pageQueryParams.getDirection(), pageQueryParams.getOrderBy());
        Page<Project> projects = projectRepository.findAll(pageable);
        return projects.map(projectBuilder::toProjectDTO);
    }

    private @NotNull PageRequest getPageRequest(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        return PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));
    }
}
