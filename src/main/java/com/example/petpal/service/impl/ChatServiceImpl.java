package com.example.petpal.service.impl;

import com.example.petpal.entity.ChatMessage;
import com.example.petpal.service.ChatService;
import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private Firestore firestore; // Injecting Ionut's Firestore Bean

    public void saveMessage(ChatMessage message) {
        // Generate a unique ID if one doesn't exist
        if (message.getId() == null) {
            message.setId(UUID.randomUUID().toString());
        }

        // Save to "messages" collection in Firestore
        // This uses the Google Admin SDK dependency from pom.xml
        firestore.collection("messages")
                .document(message.getId())
                .set(message);
    }
}