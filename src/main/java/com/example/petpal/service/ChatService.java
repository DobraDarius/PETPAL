package com.example.petpal.service;

import com.example.petpal.entity.ChatMessage;
import java.util.List;

public interface ChatService {
    void saveMessage(ChatMessage message);
    List<String> getInteractedUsers(String currentUserId);
    List<ChatMessage> getConversation(String user1, String user2);
}