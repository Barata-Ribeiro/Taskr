package com.barataribeiro.taskr.activity;

import com.barataribeiro.taskr.activity.enums.ActivityType;
import com.barataribeiro.taskr.activity.events.comment.CommentCreatedEvent;
import com.barataribeiro.taskr.activity.events.comment.CommentDeletedEvent;
import com.barataribeiro.taskr.activity.events.comment.CommentUpdatedEvent;
import com.barataribeiro.taskr.activity.events.project.ProjectAddMemberEvent;
import com.barataribeiro.taskr.activity.events.project.ProjectCreatedEvent;
import com.barataribeiro.taskr.activity.events.project.ProjectRemoveMemberEvent;
import com.barataribeiro.taskr.activity.events.project.ProjectUpdateEvent;
import com.barataribeiro.taskr.activity.events.task.*;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActivityEventListener {
    private final ActivityRepository activityRepository;

    // Project

    @EventListener
    public void onProjectCreated(@NotNull ProjectCreatedEvent event) {
        final String description = String.format("Founded project '%s'.", event.getProject().getTitle());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.CREATE_PROJECT)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onProjectUpdated(@NotNull ProjectUpdateEvent event) {
        final String description = String.format("Updated the project and %s", event.getReason());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.UPDATE_PROJECT)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onProjectAddMember(@NotNull ProjectAddMemberEvent event) {
        final String description = String.format("Added '%s' to the project.", event.getMemberAdded());
        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.ADD_MEMBER)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();
        activityRepository.save(activity);
    }

    @EventListener
    public void onProjectRemoveMember(@NotNull ProjectRemoveMemberEvent event) {
        final String description = String.format("Removed '%s' from the project.", event.getMemberRemoved());
        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.REMOVE_MEMBER)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();
        activityRepository.save(activity);
    }

    // Task

    @EventListener
    public void onTaskCreated(@NotNull TaskCreatedEvent event) {
        final String description = String.format("Created the task '%s' in project '%s'.",
                                                 event.getTask().getTitle(),
                                                 event.getProject().getTitle());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.ADD_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onTaskUpdated(@NotNull TaskUpdatedEvent event) {
        final String description = String.format("Updated the task '%s' and %s",
                                                 event.getTaskTitle(), event.getReason());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.UPDATE_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onTaskAssigned(@NotNull TaskAssignEvent event) {
        final String description = String.format("Assigned the task '%s' to '%s'.",
                                                 event.getTaskTitle(),
                                                 event.getUserDisplayName());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.ASSIGN_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onTaskUnassigned(@NotNull TaskUnassignEvent event) {
        final String description = String.format("Unassigned the task '%s' from '%s'.",
                                                 event.getTaskTitle(),
                                                 event.getUserDisplayName());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.UNASSIGN_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onTaskCompleted(@NotNull TaskCompleteEvent event) {
        final String description = String.format("Completed the task '%s'.",
                                                 event.getTaskTitle());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.COMPLETE_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onTaskReopened(@NotNull TaskReopenEvent event) {
        final String description = String.format("Reopened the task '%s'.",
                                                 event.getTaskTitle());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.REOPEN_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    @EventListener
    public void onTaskDeleted(@NotNull TaskDeleteEvent event) {
        final String description = String.format("Deleted the task of identifier '%s'.",
                                                 event.getTaskId());

        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.DELETE_TASK)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();

        activityRepository.save(activity);
    }

    // Comment

    @EventListener
    public void onCommentCreated(@NotNull CommentCreatedEvent event) {
        final String description = String.format("Commented on task: '%s'", event.getComment().getTask().getTitle());
        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.ADD_COMMENT)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();
        activityRepository.save(activity);
    }

    @EventListener
    public void onCommentUpdated(@NotNull CommentUpdatedEvent event) {
        final String description = String.format("Updated a comment on task: '%s'.",
                                                 event.getComment().getTask().getTitle());
        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.UPDATE_COMMENT)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();
        activityRepository.save(activity);
    }

    @EventListener
    public void onCommentDeleted(@NotNull CommentDeletedEvent event) {
        final String description = String.format("Deleted a comment of identifier '%s' on task: '%s'",
                                                 event.getCommentId(), event.getTaskTitle());
        Activity activity = Activity.builder()
                                    .username(event.getUsername())
                                    .action(ActivityType.DELETE_COMMENT)
                                    .description(description)
                                    .project(event.getProject())
                                    .build();
        activityRepository.save(activity);
    }
}
