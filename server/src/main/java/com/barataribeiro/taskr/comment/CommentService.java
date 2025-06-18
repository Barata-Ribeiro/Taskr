package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.taskr.membership.MembershipRepository;
import com.barataribeiro.taskr.task.Task;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Streamable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentService {
    private final CommentRepository commentRepository;
    private final MembershipRepository membershipRepository;
    private final CommentBuilder commentBuilder;
    private final ModelMapper modelMapper;

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
}
