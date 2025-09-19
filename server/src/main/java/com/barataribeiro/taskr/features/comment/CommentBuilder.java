package com.barataribeiro.taskr.features.comment;

import com.barataribeiro.taskr.features.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.features.user.User;
import com.barataribeiro.taskr.features.user.UserBuilder;
import com.barataribeiro.taskr.features.user.enums.Roles;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
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

    public CommentDTO fromRawRow(@NotNull Object @NotNull [] row) {
        Long commentId = ((Number) row[0]).longValue();
        CommentDTO dto = new CommentDTO();
        dto.setId(commentId);
        dto.setContent(row[1].toString());
        dto.setWasEdited((Boolean) row[3]);
        dto.setIsSoftDeleted((Boolean) row[4]);
        dto.setTaskId(((Number) row[5]).longValue());
        dto.setParentId(row[6] instanceof Number number ? number.longValue() : null);

        Instant createdAt = toInstant(row[7]);
        dto.setCreatedAt(createdAt);

        Instant updatedAt = toInstant(row[8]);
        dto.setUpdatedAt(updatedAt);

        User author = User.builder()
                          .id(toUUID(row[9]))
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

        rows.parallelStream().forEachOrdered(row -> {
            Long commentId = ((Number) row[0]).longValue();
            map.computeIfAbsent(commentId, _ -> fromRawRow(row));
        });

        List<CommentDTO> roots = new ArrayList<>();
        map.values().parallelStream().forEachOrdered(dto -> {
            if (dto.getParentId() == null) roots.add(dto);
            else {
                CommentDTO parent = map.get(dto.getParentId());
                if (parent != null) parent.getChildren().add(dto);
            }
        });

        return roots;
    }

    private @Nullable Instant toInstant(Object value) {
        return switch (value) {
            case null -> null;
            case Instant instant -> instant;
            case OffsetDateTime offsetDateTime -> offsetDateTime.toInstant();
            case Timestamp timestamp -> timestamp.toInstant();
            case LocalDateTime localDateTime -> localDateTime
                    .atZone(ZoneId.systemDefault())
                    .toInstant();
            case Date date -> Instant.ofEpochMilli((date.getTime()));
            default -> Instant.parse(value.toString());
        };
    }

    private @Nullable UUID toUUID(Object value) {
        return switch (value) {
            case null -> null;
            case UUID uuid -> uuid;
            case byte[] bytes -> {
                ByteBuffer bb = ByteBuffer.wrap(bytes);
                long high = bb.getLong();
                long low = bb.getLong();
                yield new UUID(high, low);
            }
            default -> UUID.fromString(value.toString());
        };
    }
}
