package com.neighborhoodwatch.application.service;


import com.neighborhoodwatch.application.mapper.ContactMappers;
import com.neighborhoodwatch.domain.model.Contact;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.infrastructure.repository.ContactRepository;
import com.neighborhoodwatch.presentation.dto.Contacts.ContactDto;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ContactService {

    private final ContactRepository repository;

    private final UserService userService;

    public ContactService(ContactRepository repository, @Lazy UserService userService) {
        this.repository = repository;
        this.userService = userService;
    }

    public List<ContactDto> getAllContacts(Long userId) {
         return repository.findAllByUserId(userId).stream()
                .map(ContactMappers::toContactDto)
                .toList();
    }

    public Contact getContactById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Contact createContact(User user, User contactUser) {
        Contact contact = ContactMappers.toContact(user, contactUser);
        return repository.save(contact);
    }

    public void deleteContact(Long id) {
        repository.deleteById(id);
    }

    public void updateContact(Long contactId, boolean isEmergency) {
        Contact contact = repository.findById(contactId).orElse(null);
        contact.setEmergency(isEmergency);
        repository.save(contact);
    }

    public boolean existsByUserIdAndContactUserId(Long userId, Long contactUserId) {
        return repository.existsByUserIdAndContactUserId(userId, contactUserId);
    }

    @Transactional
    public void delete(Long userId) {
        repository.deleteByUserIdOrContactUserId(userId, userId);
    }

    public int getContactsNumber(Long userId) {
        List<Contact> list = repository.findAllByUserId(userId).stream().toList();
        return list.size();
    }

    public List<User> getEmergencyContacts(Long userId) {
        List<Contact> emergencyContacts = repository.findAllByUserIdAndIsEmergencyTrue(userId);

        return emergencyContacts.stream()
                .map(contact -> userService.getUser(contact.getContactUser().getId()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

}
