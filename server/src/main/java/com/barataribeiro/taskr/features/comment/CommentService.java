package com.barataribeiro.taskr.features.comment;

import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.features.activity.events.comment.CommentDeletedEvent;
import com.barataribeiro.taskr.features.activity.events.comment.CommentUpdatedEvent;
import com.barataribeiro.taskr.features.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.features.comment.dtos.CommentRequestDTO;
import com.barataribeiro.taskr.features.membership.MembershipRepository;
import com.barataribeiro.taskr.features.notification.events.NewCommentNotificationEvent;
import com.barataribeiro.taskr.features.project.Project;
import com.barataribeiro.taskr.features.task.Task;
import com.barataribeiro.taskr.features.task.TaskRepository;
import com.barataribeiro.taskr.features.user.User;
import com.barataribeiro.taskr.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentService {
    private final CommentRepository commentRepository;
    private final MembershipRepository membershipRepository;
    private final CommentBuilder commentBuilder;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Cacheable(value = "commentsByTask")
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByTaskId(Long taskId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Tasks_Id(authentication.getName(), taskId)) {
            throw new EntityNotFoundException(Task.class.getSimpleName());
        }

        List<Object[]> rows = commentRepository.findCommentTreeRaw(taskId);

        return commentBuilder.fromRawRows(rows);
    }

    @Caching(evict = {@CacheEvict(value = "userAccount", key = "#authentication.name"),
                      @CacheEvict(value = "publicUserProfile", key = "#authentication.name"),
                      @CacheEvict(value = {"commentsByTask", "task", "globalStats", "projectActivities", "projectStats",
                                           "userStats"}, allEntries = true),})
    @Transactional
    public CommentDTO createComment(Long taskId, CommentRequestDTO body, @NotNull Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
                                    .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Task task = taskRepository.findById(taskId)
                                  .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

        Project project = task.getProject();

        if (!membershipRepository.existsByUser_UsernameAndProject_Id(authentication.getName(), project.getId())) {
            throw new EntityNotFoundException(Project.class.getSimpleName());
        }

        Comment newComment = Comment.builder()
                                    .author(author)
                                    .task(task)
                                    .content(body.getBody())
                                    .build();

        Optional.ofNullable(body.getParentId()).ifPresent(parentId -> {
            Comment parent = commentRepository
                    .findById(parentId)
                    .orElseThrow(() -> new EntityNotFoundException(Comment.class.getSimpleName()));

            newComment.setParent(parent);
        });

        List<User> taskAssignees = task.getAssignees().stream().parallel()
                                       .filter(assignee -> !assignee.getUsername().equals(authentication.getName()))
                                       .toList();

        taskAssignees.parallelStream()
                     .forEachOrdered(assignee -> applicationEventPublisher
                             .publishEvent(new NewCommentNotificationEvent(this, assignee, task.getTitle(),
                                                                           author.getUsername())));

        applicationEventPublisher.publishEvent(new NewCommentNotificationEvent(this, author, task.getTitle(),
                                                                               author.getUsername()));

        return commentBuilder.toCommentDTO(commentRepository.saveAndFlush(newComment));
    }

    @Caching(evict = {@CacheEvict(value = "userAccount", key = "#authentication.name"),
                      @CacheEvict(value = "publicUserProfile", key = "#authentication.name"),
                      @CacheEvict(value = {"commentsByTask", "task", "globalStats", "projectActivities", "projectStats",
                                           "userStats"}, allEntries = true),})
    @Transactional
    public CommentDTO updateComment(Long commentId, Long taskId, @NotNull CommentRequestDTO body,
                                    @NotNull Authentication authentication) {
        Comment comment = commentRepository
                .findByIdAndAuthor_UsernameAndTask_Id(commentId, authentication.getName(), taskId)
                .orElseThrow(() -> new EntityNotFoundException(Comment.class.getSimpleName()));

        comment.setContent(body.getBody());
        comment.setWasEdited(true);

        applicationEventPublisher.publishEvent(new CommentUpdatedEvent(this, comment.getTask().getProject(), comment,
                                                                       authentication.getName()));

        return commentBuilder.toCommentDTO(commentRepository.saveAndFlush(comment));
    }

    @Caching(evict = {@CacheEvict(value = "userAccount", key = "#authentication.name"),
                      @CacheEvict(value = "publicUserProfile", key = "#authentication.name"),
                      @CacheEvict(value = {"commentsByTask", "task", "globalStats", "projectActivities", "projectStats",
                                           "userStats"}, allEntries = true),})
    @Transactional
    public void deleteComment(Long commentId, Long taskId, @NotNull Authentication authentication) {
        long wasDeleted = commentRepository
                .deleteByIdAndTask_IdAndAuthor_Username(commentId, taskId, authentication.getName());
        if (wasDeleted == 0) throw new IllegalRequestException("Comment not found or you are not the author");

        Task task = taskRepository.findById(taskId)
                                  .orElseThrow(() -> new EntityNotFoundException(Task.class.getSimpleName()));

        String taskTitle = task.getTitle();
        Project project = task.getProject();

        applicationEventPublisher.publishEvent(new CommentDeletedEvent(this, project, commentId, taskTitle,
                                                                       authentication.getName()));
    }
}
