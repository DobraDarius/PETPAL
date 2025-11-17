package com.example.petpal.service;

import com.example.petpal.entity.User;
import java.util.List;

public interface UserService {

    User createUser(User user);



    User getUserById(String id);
    List<User> getAllUsers();



    User updateUser(String id, User updatedUser);



    void deleteUser(String id);
}
