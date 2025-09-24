package com.neighborhoodwatch.presentation.dto.Comment;

import lombok.*;


public class CreateCommentDto {

    private Long incidentId;
    private String text;

    public CreateCommentDto() { }

    public CreateCommentDto(Long incidentId, String text) {
        this.incidentId = incidentId;
        this.text = text;
    }

    public Long getIncidentId() {
        return incidentId;
    }
    public void setIncidentId(Long incidentId) {
        this.incidentId = incidentId;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }

}
