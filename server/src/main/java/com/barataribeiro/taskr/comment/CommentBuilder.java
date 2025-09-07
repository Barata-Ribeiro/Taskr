package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.user.User;
import com.barataribeiro.taskr.user.UserBuilder;
import com.barataribeiro.taskr.user.enums.Roles;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentBuilder {
    private final ModelMapper modelMapper;
    private final UserBuilder userBuilder;

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
                map(source.getAuthor(), destination.getAuthor());
            }
        });
    }

    public CommentDTO toCommentDTO(@NotNull Comment comment) {
        return modelMapper.map(comment, CommentDTO.class);
    }

    public CommentDTO fromRawRow(@NotNull Object[] row) {
        Long commentId = ((Number) row[0]).longValue();
        CommentDTO dto = new CommentDTO();
        dto.setId(commentId);
        dto.setContent(row[1].toString());
        dto.setWasEdited((Boolean) row[3]);
        dto.setIsSoftDeleted((Boolean) row[4]);
        dto.setTaskId(((Number) row[5]).longValue());
        dto.setParentId(row[6] instanceof Number number ? number.longValue() : null);

        Instant createdAt = row[7] instanceof Instant instant ? instant : ((Timestamp) row[7]).toInstant();
        dto.setCreatedAt(createdAt);

        Instant updatedAt = row[8] instanceof Instant instant ? instant : ((Timestamp) row[8]).toInstant();
        dto.setUpdatedAt(updatedAt);

        User author = User.builder()
                          .id(UUID.fromString(row[9].toString()))
                          .username(row[10].toString())
                          .role(Roles.valueOf(row[11].toString()))
                          .displayName(row[12].toString())
                          .avatarUrl(Objects.toString(row[13], null))
                          .isPrivate((Boolean) row[14])
                          .isVerified((Boolean) row[15])
                          .build();

        dto.setAuthor(userBuilder.toAuthorDTO(author));
        dto.setChildren(new ArrayList<>());
        dto.setChildrenCount(0L);

        return dto;
    }

    public List<CommentDTO> fromRawRows(@NotNull List<Object[]> rows) {
        Map<Long, CommentDTO> map = new LinkedHashMap<>();

        rows.forEach(row -> {
            Long commentId = ((Number) row[0]).longValue();
            map.computeIfAbsent(commentId, _ -> fromRawRow(row));
        });

        List<CommentDTO> roots = new ArrayList<>();
        for (CommentDTO dto : map.values()) {
            if (dto.getParentId() == null) roots.add(dto);
            else {
                CommentDTO parent = map.get(dto.getParentId());
                if (parent != null) parent.getChildren().add(dto);
            }
        }

        return roots;
    }
}
