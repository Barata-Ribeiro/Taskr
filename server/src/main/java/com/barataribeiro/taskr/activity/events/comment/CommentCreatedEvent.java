package com.barataribeiro.taskr.activity.events.comment;

import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.comment.Comment;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class CommentCreatedEvent extends ApplicationEvent {
    private final Project project;
    private final Comment comment;
    private final String username;

    public CommentCreatedEvent(Object source, Project project, Comment comment, String username) {
        super(source);
        this.project = project;
        this.comment = comment;
        this.username = username;
    }
}

