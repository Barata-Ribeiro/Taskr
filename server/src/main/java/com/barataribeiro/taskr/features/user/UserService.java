package com.barataribeiro.taskr.features.user;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.taskr.features.activity.ActivityRepository;
import com.barataribeiro.taskr.features.membership.Membership;
import com.barataribeiro.taskr.features.membership.MembershipBuilder;
import com.barataribeiro.taskr.features.membership.MembershipRepository;
import com.barataribeiro.taskr.features.membership.dtos.MembershipUsersDTO;
import com.barataribeiro.taskr.features.project.Project;
import com.barataribeiro.taskr.features.user.dtos.UserAccountDTO;
import com.barataribeiro.taskr.features.user.dtos.UserProfileDTO;
import com.barataribeiro.taskr.features.user.dtos.UserUpdateRequestDTO;
import com.barataribeiro.taskr.features.user.enums.Roles;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.util.Streamable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserService {
    private final UserRepository userRepository;
    private final UserBuilder userBuilder;
    private final PasswordEncoder passwordEncoder;
    private final MembershipRepository membershipRepository;
    private final MembershipBuilder membershipBuilder;
    private final ActivityRepository activityRepository;

    @Cacheable(value = "publicUserProfile", key = "#username")
    @Transactional(readOnly = true)
    public UserProfileDTO getPublicUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        return userBuilder.toUserProfileDTO(user);
    }

    @Cacheable(value = "userMemberships", key = "#projectId + '_' + #authentication.name")
    @Transactional(readOnly = true)
    public List<MembershipUsersDTO> getProjectMemberships(Long projectId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), projectId)) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Streamable<Membership> memberships = membershipRepository.findByProject_Id(projectId);

        return memberships.stream().parallel().map(membershipBuilder::toMembershipUsersDTO).toList();
    }

    @Cacheable(value = "userAccount", key = "#authentication.name")
    @Transactional(readOnly = true)
    public UserAccountDTO getAccountDetails(@NotNull Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));
        return userBuilder.toUserAccountDTO(user);
    }

    @Caching(evict = {@CacheEvict(value = {"userAccount", "publicUserProfile"}, key = "#authentication.name"),
                      @CacheEvict(value = {"userMemberships", "globalStats", "userStats"}, allEntries = true),},
             put = @CachePut(value = "userAccount", key = "#authentication.name", condition = "#body != null"))
    @Transactional
    public UserAccountDTO updateAccountDetails(@NotNull Authentication authentication,
                                               @NotNull UserUpdateRequestDTO body) {
        User userToUpdate = userRepository.findByUsername(authentication.getName())
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Roles userRole = userToUpdate.getRole();

        boolean userBannedOrNone = Roles.BANNED.equals(userRole) || Roles.NONE.equals(userRole);

        if (userBannedOrNone) {
            throw new IllegalRequestException("Account update failed; Account is either banned or not authorized.");
        }

        verifyIfBodyExistsThenUpdateProperties(body, userToUpdate);

        return userBuilder.toUserAccountDTO(userRepository.saveAndFlush(userToUpdate));
    }

    @Caching(evict = {@CacheEvict(value = {"userAccount", "publicUserProfile"}, key = "#authentication.name"),
                      @CacheEvict(value = {"userMemberships", "globalStats", "userStats"}, allEntries = true),})
    @Transactional
    public void deleteAccount(@NotNull Authentication authentication) {
        long wasDeleted = userRepository.deleteByUsername(authentication.getName());

        if (wasDeleted == 0) {
            throw new IllegalRequestException("Account deletion failed; Account not found or not authorized.");
        }
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
        Optional.ofNullable(body.getNewPassword()).ifPresent(s -> {
            if (body.getCurrentPassword().isBlank()) {
                throw new IllegalRequestException("Current password must be provided to change the password.");
            }

            boolean passwordMatches = passwordEncoder.matches(body.getCurrentPassword(), userToUpdate.getPassword());

            if (!passwordMatches) {
                throw new InvalidCredentialsException("Authorization failed; Current password does not match.");
            }

            if (s.isBlank()) throw new IllegalRequestException("New password cannot be blank.");

            if (s.equals(body.getCurrentPassword())) {
                throw new IllegalRequestException("New password cannot be the same as the current password.");
            }

            userToUpdate.setPassword(passwordEncoder.encode(s));
        });
    }
}
