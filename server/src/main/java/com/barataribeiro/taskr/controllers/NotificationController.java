package com.barataribeiro.taskr.controllers;

import com.barataribeiro.taskr.dtos.RestResponseDTO;
import com.barataribeiro.taskr.dtos.notification.NotificationDTO;
import com.barataribeiro.taskr.services.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
