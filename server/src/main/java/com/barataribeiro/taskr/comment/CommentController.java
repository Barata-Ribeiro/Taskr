package com.barataribeiro.taskr.comment;

import com.barataribeiro.taskr.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.helpers.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Comment", description = "Endpoints for managing comments")
public class CommentController {
    private final CommentService commentService;

    @Operation(summary = "Get comments by task ID",
               description = "Retrieves a list of comments associated with a specific task.")
    @GetMapping("/task/{taskId}")
    public ResponseEntity<RestResponse<List<CommentDTO>>> getCommentsByTaskId(@PathVariable Long taskId,
                                                                              Authentication authentication) {
        List<CommentDTO> comments = commentService.getCommentsByTaskId(taskId, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Comments retrieved successfully", comments));
    }
}
