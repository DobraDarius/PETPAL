package com.example.petpal.service;

import com.example.petpal.entity.ChatMessage;
import java.util.List;
import java.util.Map;

public interface ChatService {
    void saveMessage(ChatMessage message);
    List<Map<String, String>> getInteractedUsers(String currentUserId);
    List<ChatMessage> getConversation(String user1, String user2);
}