package com.example.petpal.service.impl;

import com.example.petpal.entity.ChatMessage;
import com.example.petpal.service.ChatService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private Firestore firestore;

    @Override
    public void saveMessage(ChatMessage message) {
        if (message.getId() == null) {
            message.setId(UUID.randomUUID().toString());
        }
        firestore.collection("messages").document(message.getId()).set(message);
    }

    // ... inside ChatServiceImpl ...

    @Override
    public List<Map<String, String>> getInteractedUsers(String currentUserId) {
        try {
            // 1. Get all messages where I am the receiver
            ApiFuture<QuerySnapshot> future = firestore.collection("messages")
                    .whereEqualTo("receiverId", currentUserId)
                    .get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            // 2. Extract unique Sender IDs
            List<String> uniqueIds = documents.stream()
                    .map(doc -> doc.getString("senderId"))
                    .filter(id -> id != null)
                    .filter(id -> !id.equals(currentUserId))
                    .distinct()
                    .collect(Collectors.toList());

            // 3. For each ID, fetch the Real Name from "users" collection
            List<Map<String, String>> contactList = new ArrayList<>();

            for (String id : uniqueIds) {
                // Fetch User Doc
                var userDoc = firestore.collection("users").document(id).get().get();

                String displayName = "Unknown User";
                if (userDoc.exists()) {
                    // Try to get 'name', fall back to 'email', then ID
                    if (userDoc.getString("name") != null) {
                        displayName = userDoc.getString("name");
                    } else if (userDoc.getString("email") != null) {
                        displayName = userDoc.getString("email");
                    }
                }

                // Create a nice object: { "id": "123", "name": "Pablo" }
                Map<String, String> contact = new HashMap<>();
                contact.put("id", id);
                contact.put("name", displayName);

                contactList.add(contact);
            }

            return contactList;

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    // Fetch History
    @Override
    public List<ChatMessage> getConversation(String user1, String user2) {
        try {
            // 1. Get all messages (Simple approach to avoid Index errors)
            ApiFuture<QuerySnapshot> future = firestore.collection("messages").get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            return documents.stream()
                    .map(doc -> doc.toObject(ChatMessage.class))
                    // 2. Filter: Keep only messages strictly between User1 and User2
                    .filter(msg ->
                            (msg.getSenderId().equals(user1) && msg.getReceiverId().equals(user2)) ||
                                    (msg.getSenderId().equals(user2) && msg.getReceiverId().equals(user1))
                    )
                    // 3. Sort by Time (Oldest first)
                    .sorted(Comparator.comparingLong(ChatMessage::getTimestamp))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}