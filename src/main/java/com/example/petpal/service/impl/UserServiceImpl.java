package com.example.petpal.service.impl;

import com.example.petpal.entity.User;
import com.example.petpal.service.UserService;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Primary
public class UserServiceImpl implements UserService {

    private final Firestore db;
    private static final String COLLECTION = "users";

    public UserServiceImpl(Firestore db) {
        this.db = db;
    }

    private CollectionReference users() {
        return db.collection(COLLECTION);
    }

    @Override
    public User createUser(User user) {
        String id = users().document().getId();
        user.setId(id);
        users().document(id).set(user);
        return user;
    }

    @Override
    public User getUserById(String id) {
        try {
            return users().document(id).get().get().toObject(User.class);
        } catch (Exception e) {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public List<User> getAllUsers() {
        try {
            return users().get().get().getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(User.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Cannot load users");
        }
    }


    @Override
    public User updateUser(String id, User updated) {
        updated.setId(id);
        users().document(id).set(updated);
        return updated;
    }


    @Override
    public void deleteUser(String id) {
        users().document(id).delete();
    }
}
