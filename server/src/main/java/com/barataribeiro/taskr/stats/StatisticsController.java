package com.barataribeiro.taskr.stats;

import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.stats.dtos.GlobalStatsDTO;
import com.barataribeiro.taskr.stats.dtos.ProjectStatsDTO;
import com.barataribeiro.taskr.stats.dtos.UserStatsDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Statistics", description = "Endpoints for application statistics and reports")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/global")
    @Operation(summary = "Get global statistics (ADMIN only)",
               description = "Returns global statistics for the application. Only accessible by ADMIN users.")
    public ResponseEntity<RestResponse<GlobalStatsDTO>> getGlobalStats(Authentication authentication) {
        GlobalStatsDTO stats = statisticsService.getGlobalStats(authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Global statistics retrieved successfully",
                                                    stats));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get project statistics",
               description = "Returns statistics for a specific project. Accessible by project members.")
    public ResponseEntity<RestResponse<ProjectStatsDTO>> getProjectStats(@PathVariable Long projectId,
                                                                         Authentication authentication) {
        ProjectStatsDTO stats = statisticsService.getProjectStats(projectId, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Project statistics retrieved successfully",
                                                    stats));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user statistics",
               description = "Returns statistics for a specific user. Accessible by the user or ADMIN.")
    public ResponseEntity<RestResponse<UserStatsDTO>> getUserStats(@PathVariable String userId,
                                                                   Authentication authentication) {
        UserStatsDTO stats = statisticsService.getUserStats(userId, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "User statistics retrieved successfully",
                                                    stats));
    }
}
