package com.barataribeiro.taskr.features.comment;

import com.barataribeiro.taskr.features.comment.dtos.CommentDTO;
import com.barataribeiro.taskr.features.comment.dtos.CommentRequestDTO;
import com.barataribeiro.taskr.helpers.RestResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/task/{taskId}")
    @Operation(summary = "Create a new comment",
               description = "Adds a new comment to a specific task.")
    public ResponseEntity<RestResponse<CommentDTO>> createComment(@PathVariable Long taskId,
                                                                  @RequestBody CommentRequestDTO body,
                                                                  Authentication authentication) {
        CommentDTO createdComment = commentService.createComment(taskId, body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new RestResponse<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                      "Comment created successfully", createdComment));
    }

    @PatchMapping("/{commentId}/task/{taskId}")
    @Operation(summary = "Update a comment",
               description = "Updates an existing comment for a specific task.")
    public ResponseEntity<RestResponse<CommentDTO>> updateComment(@PathVariable Long commentId,
                                                                  @PathVariable Long taskId,
                                                                  @RequestBody CommentRequestDTO body,
                                                                  Authentication authentication) {
        CommentDTO updatedComment = commentService.updateComment(commentId, taskId, body, authentication);
        return ResponseEntity.ok(new RestResponse<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                    "Comment updated successfully", updatedComment));
    }

    @DeleteMapping("/{commentId}/task/{taskId}")
    @Operation(summary = "Delete a comment",
               description = "Removes a comment from a specific task.")
    public ResponseEntity<RestResponse<Void>> deleteComment(@PathVariable Long commentId, @PathVariable Long taskId,
                                                            Authentication authentication) {
        commentService.deleteComment(commentId, taskId, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new RestResponse<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                      "Comment deleted successfully", null));
    }
}
