package com.neighborhoodwatch.presentation.dto.Contacts;

import lombok.Getter;
import lombok.Setter;


public class UpdateContactDto {
    private Long contactId;
    private boolean isEmergency;

    public UpdateContactDto () {}

    public UpdateContactDto( Long contactId, boolean isEmergency) {
        this.contactId = contactId;
        this.isEmergency = isEmergency;
    }

    public Long getContactId() {
        return contactId;
    }
    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }
    public boolean isEmergency() {
        return isEmergency;
    }
    public void setEmergency(boolean emergency) {
        isEmergency = emergency;
    }

}
