package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.helpers.PageQueryParamsDTO;
import com.barataribeiro.taskr.helpers.RestResponse;
import com.barataribeiro.taskr.notification.dtos.LatestNotificationsDTO;
import com.barataribeiro.taskr.notification.dtos.NotificationDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Notification", description = "Endpoints for managing notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @Operation(summary = "Get the latest notification",
               description = "Retrieves the most recent notification for the authenticated user.")
    @GetMapping("/latest")
    public ResponseEntity<RestResponse<LatestNotificationsDTO>> getLatestNotification(Authentication authentication) {
        LatestNotificationsDTO latestNotification = notificationService.getLatestNotification(authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Latest notification retrieved successfully", latestNotification));
    }

    @Operation(summary = "Get all notifications paginated",
               description = "Retrieves all notifications for the authenticated user, paginated.")
    @GetMapping
    public ResponseEntity<RestResponse<Page<NotificationDTO>>> getAllNotifications(
            @ModelAttribute PageQueryParamsDTO pageQueryParams,
            Authentication authentication) {
        Page<NotificationDTO> notifications = notificationService.getAllNotifications(pageQueryParams, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Notifications retrieved successfully", notifications));
    }

    @Operation(summary = "Change the notification status",
               description = "Updates the status of a notification for the authenticated user.")
    @PatchMapping("/{notifId}/status")
    public ResponseEntity<RestResponse<NotificationDTO>> changeNotificationStatus(@PathVariable Long notifId,
                                                                                  @RequestParam Boolean isRead,
                                                                                  Authentication authentication) {
        NotificationDTO updatedNotification = notificationService
                .changeNotificationStatus(notifId, isRead, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Notification status updated successfully", updatedNotification));
    }

    @Operation(summary = "Change the notification status in bulk",
               description = "Updates the status of multiple notifications for the authenticated user.")
    @PatchMapping("/status")
    public ResponseEntity<RestResponse<List<NotificationDTO>>> changeNotificationsStatusInBulk(
            @RequestBody @Valid @NotNull List<Long> notifIds,
            @RequestParam Boolean isRead, Authentication authentication) {
        List<NotificationDTO> updatedNotifications = notificationService
                .changeNotificationsStatusInBulk(notifIds, isRead, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Notifications status updated successfully", updatedNotifications));
    }

    @Operation(summary = "Delete a notification",
               description = "Deletes a notification for the authenticated user.")
    @DeleteMapping("/{notifId}")
    public ResponseEntity<RestResponse<Void>> deleteNotification(@PathVariable Long notifId,
                                                                 Authentication authentication) {
        notificationService.deleteNotification(notifId, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                      "Notification deleted successfully", null));
    }

    @Operation(summary = "Delete a notification in bulk",
               description = "Deletes multiple notifications for the authenticated user.")
    @DeleteMapping
    public ResponseEntity<RestResponse<Void>> deleteNotificationsInBulk(@RequestParam List<Long> notifIds,
                                                                        Authentication authentication) {
        notificationService.deleteNotificationsInBulk(notifIds, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                      "Notifications deleted successfully", null));
    }
}
