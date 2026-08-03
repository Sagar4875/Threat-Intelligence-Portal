package com.example.threatintelligenceportalspring.service;

import com.example.threatintelligenceportalspring.entity.User;
import com.example.threatintelligenceportalspring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ==========================
    // Register User
    // ==========================
    @Override
    public User registerUser(User user) {

        System.out.println("\n========== REGISTER USER ==========");
        System.out.println("Name           : " + user.getFullName());
        System.out.println("Email          : " + user.getEmail());
        System.out.println("Role           : " + user.getRole());
        System.out.println("Before Encode  : " + user.getPassword());

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        // Allow only one ADMIN
        if ("ADMIN".equalsIgnoreCase(user.getRole())
                && userRepository.existsByRole("ADMIN")) {

            throw new RuntimeException("Only one ADMIN is allowed.");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        System.out.println("After Encode   : " + user.getPassword());

        User savedUser = userRepository.save(user);

        System.out.println("Saved User ID  : " + savedUser.getUserId());
        System.out.println("========== USER SAVED ==========\n");

        return savedUser;
    }

    // ==========================
    // Login
    // ==========================
    @Override
    public Optional<User> login(String email, String password) {

        System.out.println("\n========== LOGIN ==========");
        System.out.println("Email Entered  : " + email);

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            System.out.println("User not found!");
            return Optional.empty();
        }

        System.out.println("DB Password    : " + user.get().getPassword());

        boolean matched =
                passwordEncoder.matches(password, user.get().getPassword());

        System.out.println("Password Match : " + matched);

        if (matched) {
            System.out.println("Login Success!");
            return user;
        }

        System.out.println("Invalid Password!");
        return Optional.empty();
    }

    // ==========================
    // Get All Users
    // ==========================
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ==========================
    // Get User By Id
    // ==========================
    @Override
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // ==========================
    // Create User
    // ==========================
    @Override
    public User createUser(User user) {
        return registerUser(user);
    }

    // ==========================
    // Update User
    // ==========================
    @Override
    public User updateUser(Integer id, User updatedUser) {

        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<User> emailUser =
                userRepository.findByEmail(updatedUser.getEmail());

        if (emailUser.isPresent()
                && !emailUser.get().getUserId().equals(existing.getUserId())) {

            throw new RuntimeException("Email already exists.");
        }

        if ("ADMIN".equalsIgnoreCase(updatedUser.getRole())
                && !"ADMIN".equalsIgnoreCase(existing.getRole())
                && userRepository.existsByRole("ADMIN")) {

            throw new RuntimeException("Only one ADMIN is allowed.");
        }

        existing.setFullName(updatedUser.getFullName());
        existing.setEmail(updatedUser.getEmail());
        existing.setRole(updatedUser.getRole());
        existing.setStatus(updatedUser.getStatus());

        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword().trim().isEmpty()) {

            existing.setPassword(
                    passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existing);
    }

    // ==========================
    // Delete User
    // ==========================
    @Override
    public void deleteUser(Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Administrator cannot be deleted.");
        }

        userRepository.delete(user);
    }
}