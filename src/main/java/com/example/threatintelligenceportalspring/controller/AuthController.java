package com.example.threatintelligenceportalspring.controller;

import com.example.threatintelligenceportalspring.dto.LoginResponse;
import com.example.threatintelligenceportalspring.entity.User;
import com.example.threatintelligenceportalspring.security.JwtService;
import com.example.threatintelligenceportalspring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // ===========================
    // Register User
    // ===========================

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            User savedUser = userService.registerUser(user);

            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        }

    }

    // ===========================
    // Login User
    // ===========================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        Optional<User> loginUser =
                userService.login(user.getEmail(), user.getPassword());

        if (loginUser.isPresent()) {

            User authenticatedUser = loginUser.get();

            String token =
                    jwtService.generateToken(authenticatedUser.getEmail());

            LoginResponse response =
                    new LoginResponse(
                            token,
                            authenticatedUser.getUserId(),
                            authenticatedUser.getFullName(),
                            authenticatedUser.getEmail(),
                            authenticatedUser.getRole()
                    );

            return ResponseEntity.ok(response);

        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid Email or Password");

    }

}