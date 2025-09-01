package com.barataribeiro.taskr.admin;

import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.project.dtos.ProjectCompleteDTO;
import com.barataribeiro.taskr.project.dtos.ProjectDTO;
import com.barataribeiro.taskr.user.dtos.UserProfileDTO;
import com.barataribeiro.taskr.user.dtos.UserSearchDTO;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import com.barataribeiro.taskr.user.dtos.UserUpdateRequestDTO;
import com.barataribeiro.taskr.user.enums.Roles;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Admin", description = "Endpoints for administrative tasks")
public class AdminController {
    private final AdminService adminService;

    // Users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users",
               description = "Retrieves a paginated list of all user accounts in the system.")
    public ResponseEntity<RestResponse<Page<UserSecurityDTO>>> getAllUsers(
            @ModelAttribute PageQueryParamsDTO pageQueryParams) {
        Page<UserSecurityDTO> users = adminService.getAllUsers(pageQueryParams);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Users retrieved successfully", users));
    }

    @GetMapping("/users/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search users by term",
               description = "Searches for users by a search term in username, email, display name, or full name.")
    public ResponseEntity<RestResponse<Set<UserSearchDTO>>> searchUsersByTerm(@RequestParam String term) {
        Set<UserSearchDTO> users = adminService.searchUsersByTerm(term);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Users retrieved successfully", users));
    }

    @GetMapping("/users/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by username",
               description = "Retrieves detailed information about a user by their username.")
    public ResponseEntity<RestResponse<UserProfileDTO>> getUserByUsername(@PathVariable String username) {
        UserProfileDTO user = adminService.getUserByUsername(username);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "User retrieved successfully", user));
    }

    @PatchMapping("/users/{username}/toggle-verification")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle user verification",
               description = "Toggles the verification status of a user account by username.")
    public ResponseEntity<RestResponse<UserProfileDTO>> toggleUserVerification(@PathVariable String username) {
        UserProfileDTO user = adminService.toggleUserVerification(username);

        String isVerified = Boolean.TRUE.equals(user.getIsVerified()) ? "verified" : "unverified";
        String message = String.format("You have successfully %s the user", isVerified);

        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(), message, user));
    }

    @PatchMapping("/users/{username}/toggle-ban")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle user ban status",
               description = "Toggles the ban status of a user account by username. Admins cannot ban themselves.")
    public ResponseEntity<RestResponse<UserProfileDTO>> toggleUserBan(@PathVariable String username,
                                                                      Authentication authentication) {
        UserProfileDTO user = adminService.toggleUserBanStatus(username, authentication);

        boolean isBanned = user.getRole() == Roles.BANNED;
        String status = isBanned ? "banned" : "unbanned";
        String message = String.format("You have successfully %s the user", status);

        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(), message, user));
    }

    @PatchMapping("/users/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user by username",
               description = "Updates user account details by username. Admins can update any user except themselves.")
    public ResponseEntity<RestResponse<UserProfileDTO>> updateUserByUsername(@PathVariable String username,
                                                                             Authentication authentication,
                                                                             @RequestBody @Valid
                                                                             UserUpdateRequestDTO body) {
        UserProfileDTO updatedUser = adminService.updateUserByUsername(username, authentication, body);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "User updated successfully", updatedUser));
    }

    @DeleteMapping("/users/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user by username",
               description = "Deletes a user account by their username. Admins cannot delete themselves.")
    public ResponseEntity<RestResponse<Void>> deleteUserByUsername(@PathVariable String username,
                                                                   Authentication authentication) {
        adminService.deleteUserByUsername(username, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                      "User deleted successfully", null));
    }

    // Projects

    @GetMapping("/projects")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all projects",
               description = "Retrieves a paginated list of all projects in the system.")
    public ResponseEntity<RestResponse<Page<ProjectDTO>>> getAllProjects(
            @ModelAttribute PageQueryParamsDTO pageQueryParams) {
        Page<ProjectDTO> projects = adminService.getAllProjects(pageQueryParams);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Projects retrieved successfully", projects));
    }

    @GetMapping("/projects/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get project by ID",
               description = "Retrieves detailed information about a project by its ID.")
    public ResponseEntity<RestResponse<ProjectCompleteDTO>> getProjectById(@PathVariable Long projectId) {
        ProjectCompleteDTO project = adminService.getProjectById(projectId);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Project retrieved successfully", project));
    }

    @DeleteMapping("/projects/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete project by ID",
               description = "Deletes a project by its ID. Admins can delete any project.")
    public ResponseEntity<RestResponse<Void>> deleteProjectById(@PathVariable Long projectId) {
        adminService.deleteProjectById(projectId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                      "Project deleted successfully", null));
    }

    // Comments

    @DeleteMapping("/comments/{commentId}/toggle-delete")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Soft delete comment by ID",
               description = "Soft deletes a comment by its ID. Admins can delete any comment.")
    public ResponseEntity<RestResponse<CommentDTO>> softDeleteCommentById(@PathVariable Long commentId) {
        CommentDTO comment = adminService.softDeleteCommentById(commentId);
        String isSoftDeleted = Boolean.TRUE.equals(comment.getIsSoftDeleted()) ? "soft deleted" : "restored";
        String message = String.format("You have successfully %s the comment", isSoftDeleted);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(), message, comment));
    }
}
