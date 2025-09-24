package com.neighborhoodwatch.infrastructure.repository;

import com.neighborhoodwatch.domain.model.Contact;
import com.neighborhoodwatch.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findAllByUserId(Long userId);
    boolean existsByUserIdAndContactUserId(Long userId, Long contactUserId);
    void deleteByUserIdOrContactUserId(Long userId, Long contactUserId);

    List<Contact> findAllByUserIdAndIsEmergencyTrue(Long userId);

}
