package com.neighborhoodwatch.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "user_contact_id", nullable = false)
    private User contactUser;

    @Column(name = "is_emergency", nullable = false)
    private boolean isEmergency = false;

    public Contact() {}

    public Contact(User user, User contactUser) {
        this.user = user;
        this.contactUser = contactUser;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public User getContactUser() {
        return contactUser;
    }
    public void setContactUser(User contactUser) {
        this.contactUser = contactUser;
    }
    public boolean isEmergency() {
        return isEmergency;
    }
    public void setEmergency(boolean emergency) {
        isEmergency = emergency;
    }

}
