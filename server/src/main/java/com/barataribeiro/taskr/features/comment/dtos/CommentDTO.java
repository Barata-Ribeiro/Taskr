package com.barataribeiro.taskr.features.comment.dtos;

import com.barataribeiro.taskr.features.comment.Comment;
import com.barataribeiro.taskr.features.user.dtos.UserAuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for {@link Comment}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentDTO implements Serializable {
    private Long id;
    private String content;
    private UserAuthorDTO author;
    private Boolean wasEdited;
    private Boolean isSoftDeleted;
    private Long taskId;
    private Long parentId;
    private Long childrenCount;
    private List<CommentDTO> children = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;
}