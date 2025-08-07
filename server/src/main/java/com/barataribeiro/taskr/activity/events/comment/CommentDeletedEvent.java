package com.barataribeiro.taskr.activity.events.comment;

import com.barataribeiro.taskr.project.Project;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class CommentDeletedEvent extends ApplicationEvent {
    private final Project project;
    private final Long commentId;
    private final String taskTitle;
    private final String username;

    public CommentDeletedEvent(Object source, Project project, Long commentId, String taskTitle, String username) {
        super(source);
        this.project = project;
        this.commentId = commentId;
        this.taskTitle = taskTitle;
        this.username = username;
    }
}

