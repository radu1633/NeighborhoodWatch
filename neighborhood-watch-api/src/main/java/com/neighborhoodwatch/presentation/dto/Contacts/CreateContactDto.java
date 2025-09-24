package com.neighborhoodwatch.presentation.dto.Contacts;

import lombok.Getter;
import lombok.Setter;


public class CreateContactDto {
    private Long contactUser;

    public CreateContactDto(Long contactUser, boolean isEmergency) {
        this.contactUser = contactUser;
    }

    public Long getContactUser() {
        return contactUser;
    }
    public void setContactUser(Long contactUser) {
        this.contactUser = contactUser;
    }

}
