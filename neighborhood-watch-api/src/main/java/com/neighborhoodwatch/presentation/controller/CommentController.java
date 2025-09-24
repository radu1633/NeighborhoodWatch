package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.service.CommentService;
import com.neighborhoodwatch.application.service.UserService;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Comment.CommentDto;
import com.neighborhoodwatch.presentation.dto.Comment.CreateCommentDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    public CommentController(CommentService commentService, UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long incidentId) {
        return ResponseEntity.ok(commentService.getAllComments(incidentId));
    }

    @PostMapping
    public ResponseEntity<Void> postComment(@RequestBody CreateCommentDto commentDto, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        commentService.addComment(commentDto.getIncidentId(), user.getId(), commentDto.getText());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/delete/{incidentId}")
    public ResponseEntity<Void> deleteComment(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long incidentId) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        commentService.deleteComment(incidentId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
