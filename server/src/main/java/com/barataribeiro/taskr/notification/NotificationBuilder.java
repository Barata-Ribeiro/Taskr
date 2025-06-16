package com.barataribeiro.taskr.notification;

import com.barataribeiro.taskr.notification.dtos.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationBuilder {
    private final ModelMapper modelMapper;

    public NotificationDTO toNotificationDTO(Notification notification) {
        return modelMapper.map(notification, NotificationDTO.class);
    }

    public List<NotificationDTO> toNotificationDTOList(@NotNull List<Notification> notifications) {
        return notifications.parallelStream().map(this::toNotificationDTO).toList();
    }
}
