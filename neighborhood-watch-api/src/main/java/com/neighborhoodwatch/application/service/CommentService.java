package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.domain.model.Comment;
import com.neighborhoodwatch.domain.model.Incident;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.infrastructure.repository.CommentRepository;
import com.neighborhoodwatch.presentation.dto.Comment.CommentDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository repository;
    private final UserService userService;
    private final IncidentService incidentService;
    private final NotificationService notificationService;

    public CommentService(CommentRepository repository, UserService userService, IncidentService incidentService, NotificationService notificationService) {
        this.repository = repository;
        this.userService = userService;
        this.incidentService = incidentService;
        this.notificationService = notificationService;
    }

    public List<CommentDto> getAllComments(Long incidentId) {
        return repository.findByIncidentIdOrderByTimestampAsc(incidentId)
                .stream()
                .map(comment -> new CommentDto(
                        comment.getId(),
                        comment.getUser().getId(),
                        comment.getUser().getFirstName() + " " + comment.getUser().getLastName(),
                        comment.getUser().getProfilePhoto(),
                        comment.getText(),
                        comment.getTimestamp()
                )).toList();
    }

    public void addComment(Long incidentId, Long userId, String content) {
        Incident incident = incidentService.getIncident(incidentId);
        User user = userService.getUser(userId);

        Comment comment = new Comment(
                user,
                incident,
                content
        );

        notificationService.createAndSendToUsers(
                "Comentariu nou",
                user.getFirstName() + " " + user.getLastName() + " a comentat la un incident postat de tine.",
                "COMMENT_CREATED",
                incident.getId(),
                List.of(incident.getUser())
        );

        repository.save(comment);
    }

    public void deleteComment(Long incidentId, Long commentId) {
        repository.deleteById(commentId);
    }
}
