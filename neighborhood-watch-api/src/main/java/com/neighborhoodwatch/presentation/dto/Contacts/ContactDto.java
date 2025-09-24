package com.neighborhoodwatch.presentation.dto.Contacts;

import com.neighborhoodwatch.presentation.dto.User.UserDto;
import lombok.Getter;
import lombok.Setter;

public class ContactDto {
    private Long id;
    private UserDto contactUser;
    private boolean isEmergency;

    public ContactDto(Long id, UserDto contactUser, boolean isEmergency) {
        this.id = id;
        this.contactUser = contactUser;
        this.isEmergency = isEmergency;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public UserDto getContactUser() {
        return contactUser;
    }
    public void setContactUser(UserDto contactUser) {
        this.contactUser = contactUser;
    }
    public boolean isEmergency() {
        return isEmergency;
    }
    public void setEmergency(boolean emergency) {
        isEmergency = emergency;
    }

}
