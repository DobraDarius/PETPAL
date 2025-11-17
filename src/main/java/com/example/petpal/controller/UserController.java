package com.example.petpal.controller;

import com.example.petpal.entity.User;
import com.example.petpal.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.createUser(user);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id) {
        return service.getUserById(id);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) {
        return service.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        service.deleteUser(id);
    }
}
