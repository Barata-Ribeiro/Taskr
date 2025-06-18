package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentBuilder {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void setupModelMapper() {
        modelMapper.addMappings(new PropertyMap<Comment, CommentDTO>() {
            @Override
            protected void configure() {
                skip(destination.getChildren());

                using(ctx -> {
                    Set<?> children = (Set<?>) ctx.getSource();
                    return children == null ? 0L : (long) children.size();
                }).map(source.getChildren(), destination.getChildrenCount());

                map(source.getTask().getId(), destination.getTaskId());
                map(source.getParent().getId(), destination.getParentId());
            }
        });
    }

    public CommentDTO toCommentDTO(Comment comment) {
        return modelMapper.map(comment, CommentDTO.class);
    }

    public List<CommentDTO> toCommentDTOList(@NotNull List<Comment> comments) {
        return comments.stream().parallel().map(this::toCommentDTO).collect(Collectors.toCollection(ArrayList::new));
    }
}
