package com.barataribeiro.taskr.comment.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentRequestDTO implements Serializable {
    private Long parentId;

    @NotBlank
    @Size(min = 5, max = 400, message = "Comment body must be between 5 and 400 characters")
    private String body;
}
