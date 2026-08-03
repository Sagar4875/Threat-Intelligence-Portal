package com.example.threatintelligenceportalspring.controller;

import com.example.threatintelligenceportalspring.entity.User;
import com.example.threatintelligenceportalspring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // =========================
    // Get All Users
    // =========================
    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();

    }

    // =========================
    // Get User By ID
    // =========================
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {

        return userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

    }

    // =========================
    // Create User
    // =========================
    @PostMapping
    public User createUser(@RequestBody User user) {

        return userService.createUser(user);

    }

    // =========================
    // Update User
    // =========================
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Integer id,
                           @RequestBody User user) {

        return userService.updateUser(id, user);

    }

    // =========================
    // Delete User
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {

        userService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully.");

    }

}