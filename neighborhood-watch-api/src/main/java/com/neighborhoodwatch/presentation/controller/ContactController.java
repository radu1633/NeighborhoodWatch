package com.neighborhoodwatch.presentation.controller;

import com.neighborhoodwatch.application.mapper.ContactMappers;
import com.neighborhoodwatch.application.service.ContactService;
import com.neighborhoodwatch.application.service.UserService;
import com.neighborhoodwatch.domain.model.Contact;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.presentation.dto.Contacts.ContactDto;
import com.neighborhoodwatch.presentation.dto.Contacts.CreateContactDto;
import com.neighborhoodwatch.presentation.dto.Contacts.UpdateContactDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {


    private final UserService userService;
    private final ContactService service;

    public ContactController(ContactService contactService, UserService userService) {
        this.service = contactService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<ContactDto>> getContacts(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());

        List<ContactDto> contactDto = service.getAllContacts(user.getId());

        return ResponseEntity.ok(contactDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getContact(@PathVariable Long id) {
        Contact contact = service.getContactById(id);
        if (contact == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ContactMappers.toContactDto(contact));
    }

    @PostMapping
    public ResponseEntity<ContactDto> createContact(@RequestBody CreateContactDto contactDto, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        User contactUser = userService.getUser(contactDto.getContactUser());

        Contact createdContact = service.createContact(user, contactUser);

        if (createdContact == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ContactMappers.toContactDto(createdContact));
    }

    @PutMapping
    public ResponseEntity<Void> updateContact(@RequestBody UpdateContactDto contactDto) {
        service.updateContact(contactDto.getContactId(), contactDto.isEmergency());

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        service.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/number")
    public ResponseEntity<Integer> getContactNumber(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getLoggedUser(userDetails.getUsername());
        return ResponseEntity.ok(service.getContactsNumber(user.getId()));
    }

    @GetMapping("/number/{id}")
    public ResponseEntity<Integer> getContactNumber(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(service.getContactsNumber(user.getId()));
    }
}
