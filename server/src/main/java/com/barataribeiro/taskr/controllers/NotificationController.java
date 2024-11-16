package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.notification.NotificationDTO;
import com.barataribeiro.taskr.services.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Tag(name = "Notification", description = "Notification operations for the current user.")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/latest")
    public ResponseEntity<RestResponseDTO<List<NotificationDTO>>> getLatestNotifications(Principal principal) {
        List<NotificationDTO> response = notificationService.getLatestUserNotifications(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Notifications retrieved successfully.",
                                                       response));
    }

    @GetMapping
    public ResponseEntity<RestResponseDTO<Page<NotificationDTO>>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Principal principal) {
        Page<NotificationDTO> response = notificationService.getAllUserNotifications(page, perPage, direction, orderBy,
                                                                                     principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Notifications retrieved successfully.",
                                                       response));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<RestResponseDTO<NotificationDTO>> markNotificationAsRead(@PathVariable String id,
                                                                                   Principal principal) {
        NotificationDTO response = notificationService.markNotificationAsRead(id, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Notification marked as read successfully.",
                                                       response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RestResponseDTO<NotificationDTO>> deleteNotification(@PathVariable String id,
                                                                               Principal principal) {
        notificationService.deleteNotification(id, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Notification deleted successfully.",
                                                       null));
    }
}
