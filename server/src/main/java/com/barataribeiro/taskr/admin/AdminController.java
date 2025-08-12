package com.barataribeiro.taskr.admin;

import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Admin", description = "Endpoints for administrative tasks")
public class AdminController {

    private final AdminService adminService;

    @RequestMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users",
               description = "Retrieves a paginated list of all user accounts in the system.")
    public ResponseEntity<RestResponse<Page<UserSecurityDTO>>> getAllUsers(
            @ModelAttribute PageQueryParamsDTO pageQueryParams) {
        Page<UserSecurityDTO> users = adminService.getAllUsers(pageQueryParams);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Users retrieved successfully", users));
    }
}
