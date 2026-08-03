package com.example.threatintelligenceportalspring.service;

import com.example.threatintelligenceportalspring.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Authentication
    User registerUser(User user);

    Optional<User> login(String email, String password);

    // CRUD Operations
    List<User> getAllUsers();

    Optional<User> getUserById(Integer id);

    User createUser(User user);

    User updateUser(Integer id, User user);

    void deleteUser(Integer id);

}