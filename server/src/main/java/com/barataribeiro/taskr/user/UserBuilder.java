package com.barataribeiro.taskr.user;

import com.barataribeiro.taskr.authentication.dto.RegistrationRequestDTO;
import com.barataribeiro.taskr.notification.Notification;
import com.barataribeiro.taskr.user.dtos.UserAccountDTO;
import com.barataribeiro.taskr.user.dtos.UserSecurityDTO;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserBuilder {
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void setupModelMapper() {
        modelMapper.addMappings(new PropertyMap<User, UserAccountDTO>() {
            @Override
            protected void configure() {
                using(ctx -> {
                    Set<?> createdProjects = (Set<?>) ctx.getSource();
                    return createdProjects == null ? 0L : createdProjects.size();
                }).map(source.getProjects(), destination.getTotalCreatedProjects());

                using(ctx -> {
                    Set<?> comments = (Set<?>) ctx.getSource();
                    return comments == null ? 0L : comments.size();
                }).map(source.getComments(), destination.getTotalCommentsMade());

                using(ctx -> {
                    Set<?> notifications = (Set<?>) ctx.getSource();
                    return notifications == null ? 0L : notifications
                            .parallelStream()
                            .filter(notification -> ((Notification) notification).isRead()).count();
                }).map(source.getNotifications(), destination.getReadNotificationsCount());

                using(ctx -> {
                    Set<?> notifications = (Set<?>) ctx.getSource();
                    return notifications == null ? 0L : notifications
                            .parallelStream()
                            .filter(notification -> !((Notification) notification).isRead()).count();
                }).map(source.getNotifications(), destination.getUnreadNotificationsCount());
            }
        });
    }

    public UserSecurityDTO toUserSecurityDTO(User user) {
        return modelMapper.map(user, UserSecurityDTO.class);
    }

    public UserAccountDTO toUserAccountDTO(User user) {
        return modelMapper.map(user, UserAccountDTO.class);
    }

    public User toUser(RegistrationRequestDTO body) {
        User user = modelMapper.map(body, User.class);
        user.setPassword(passwordEncoder.encode(body.getPassword()));
        return user;
    }
}
