package com.neighborhoodwatch.application.service;

import com.neighborhoodwatch.application.service.PhotoVideo.UploadMediaService;
import com.neighborhoodwatch.domain.model.Contact;
import com.neighborhoodwatch.domain.model.Neighborhood;
import com.neighborhoodwatch.domain.model.Role;
import com.neighborhoodwatch.domain.model.User;
import com.neighborhoodwatch.infrastructure.Security.JwtUtil;
import com.neighborhoodwatch.infrastructure.repository.UserRepository;
import com.neighborhoodwatch.presentation.dto.User.*;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final NeighborhoodService neighborhoodService;

    private final NotificationService notificationService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${jwt.secret}")
    private String SECRET;
    @Autowired
    private UploadMediaService uploadMediaService;
    @Autowired
    private ContactService contactService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, NeighborhoodService neighborhoodService, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.neighborhoodService = neighborhoodService;
        this.notificationService = notificationService;
    }

    public ResponseEntity<String> register(RegisterDto registerDto){
        if (!registerDto.getPassword().equals(registerDto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Parolele nu se potrivesc.");
        }
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity.badRequest().body("Email deja existent.");
        }
        String hashedPassword = passwordEncoder.encode(registerDto.getPassword());
        User user = new User(registerDto.getFirstName(), registerDto.getLastName(), registerDto.getEmail(), registerDto.getPhoneNumber(), hashedPassword, Role.USER, false);
        userRepository.save(user);

        return ResponseEntity.ok("Utilizator creat.");
    }

    public ResponseEntity<AuthResponse> login(String email, String password) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    public void logout(User user){
        user.setLogged(false);
        userRepository.save(user);
    }

    public User getLoggedUser(String email){
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return null;
        }

        return user;
    }

    public User getUser(Long userId){
        return userRepository.findById(userId).orElse(null);
    }

    public String uploadProfilePhoto(MultipartFile file, User user) throws IOException {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = FilenameUtils.getExtension(originalFilename).toLowerCase();

        if (!List.of("jpg", "jpeg", "png").contains(extension)) {
            throw new IllegalArgumentException("Only image files (.jpg, .png) are allowed");
        }

        String storedPath = uploadMediaService.uploadPhoto(file);

        user.setProfilePhoto(storedPath);
        userRepository.save(user);

        return storedPath;
    }

    public User setNeighborhood(User user, Neighborhood neighborhood) {
        user.setNeighborhood(neighborhood);
        userRepository.save(user);

        return user;
    }

    public void exitNeighborhood(User user) {
        user.setNeighborhood(null);
        userRepository.save(user);
        contactService.delete(user.getId());
    }

    public void setContacts(User user, Neighborhood neighborhood) {


        // Găsim toți ceilalți useri din același neighborhood
        List<User> neighbors = userRepository.findAllByNeighborhoodId(neighborhood.getId())
                .stream()
                .filter(u -> !u.getId().equals(user.getId())) // excludem userul curent
                .toList();

        // Adăugăm contactele
        for (User neighbor : neighbors) {
            // evităm duplicatele
            if (!contactService.existsByUserIdAndContactUserId(user.getId(), neighbor.getId())) {
                contactService.createContact(user, neighbor);
            }

            // adăugăm și invers, deci vecinul îl are pe user ca și contact
            if (!contactService.existsByUserIdAndContactUserId(neighbor.getId(), user.getId())) {
                contactService.createContact(neighbor, user);
            }
        }

        notificationService.createAndSendToUsers(
                "Contact nou",
                user.getFirstName() + " " + user.getLastName()+" s-a alăturat cartierului.",
                "CONTACT_CREATED",
                user.getId(),
                neighbors
        );
    }

    public void makeAdmin(User user) {
        user.setAdmin(true);
        userRepository.save(user);
    }

    public void deleteAdmin(User user) {
        user.setAdmin(false);
        userRepository.save(user);
    }

    public User updateUserInfo(User user, UpdateUserDto dto) {
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        return userRepository.save(user);
    }

    public List<User> findByNeighborhood(Long neighborhoodId) {
        return userRepository.findAllByNeighborhoodId(neighborhoodId);
    }


}
