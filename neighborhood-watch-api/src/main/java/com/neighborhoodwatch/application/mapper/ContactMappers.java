package com.neighborhoodwatch.application.mapper;

import com.neighborhoodwatch.domain.model.Contact;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Contacts.ContactDto;

import static com.neighborhoodwatch.application.mapper.UserMapper.toUserDto;

public class ContactMappers {

    public static ContactDto toContactDto(Contact contact) {
        return new ContactDto(
            contact.getId(),
            toUserDto(contact.getContactUser()),
            contact.isEmergency()
        );
    }

    public static Contact toContact(User user, User contactUser) {
        return new Contact(
            user,
            contactUser
        );
    }
}
