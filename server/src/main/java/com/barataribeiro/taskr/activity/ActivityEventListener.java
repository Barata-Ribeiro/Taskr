package com.barataribeiro.taskr.activity;

import com.barataribeiro.taskr.activity.events.project.ProjectCreatedEvent;
import com.barataribeiro.taskr.activity.events.task.TaskCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActivityEventListener {
    private final ActivityRepository activityRepository;

    @EventListener
    public void onProjectCreated(@NotNull ProjectCreatedEvent event) {
        final String description = String.format("User '%s' founded project '%s'.", event.getUsername(),
                                                 event.getProject().getTitle());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.CREATE_PROJECT)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onTaskCreated(@NotNull TaskCreatedEvent event) {
        final String description = String.format("User '%s' created the task '%s' in project '%s'.",
                                                 event.getUsername(), event.getTask().getTitle(),
                                                 event.getProject().getTitle());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.ADD_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }
}
