package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.comment.dtos.CommentRequestDTO;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.notification.events.NewCommentNotificationEvent;
import com.barataribeiro.taskr.project.Project;
import com.barataribeiro.taskr.task.Task;
import com.barataribeiro.taskr.task.TaskRepository;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.util.Streamable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentService {
    private final CommentRepository commentRepository;
    private final MembershipRepository membershipRepository;
    private final CommentBuilder commentBuilder;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByTaskId(Long taskId, @NotNull Authentication authentication) {
        if (!membershipRepository.existsByUser_UsernameAndProject_Tasks_Id(authentication.getName(), taskId)) {
            throw new EntityNotFoundException(Task.class.getSimpleName());
        }

        Streamable<Comment> comments = commentRepository.findByTask_IdOrderByCreatedAtDesc(taskId);
        List<CommentDTO> commentDTOS = commentBuilder.toCommentDTOList(comments.toList());

        Map<Long, CommentDTO> dtoById = new LinkedHashMap<>();
        commentDTOS.parallelStream().forEach(dto -> {
            dto.setChildren(new ArrayList<>());
            dtoById.put(dto.getId(), dto);
        });

        List<CommentDTO> roots = new ArrayList<>();
        commentDTOS.parallelStream().forEach(dto -> {
            if (dto.getParentId() == null) roots.add(dto);
            else {
                CommentDTO parentDTO = dtoById.get(dto.getParentId());
                if (parentDTO != null) parentDTO.getChildren().add(dto);
            }
        });

        return roots;
    }

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

        return commentBuilder.toCommentDTO(commentRepository.saveAndFlush(newComment));
    }

    @Transactional
    public void deleteComment(Long articleId, Long commentId, @NotNull Authentication authentication) {
        long wasDeleted = commentRepository
                .deleteByIdAndTask_IdAndAuthor_Username(commentId, articleId, authentication.getName());
        if (wasDeleted == 0) throw new IllegalRequestException("Comment not found or you are not the author");
    }
}
