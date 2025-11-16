package com.example.petpal.service;

import com.example.petpal.entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    User getUserById(Long id);

    List<User> getAllUsers();

    User updateUser(Long id, User updated);

    void deleteUser(Long id);
}
