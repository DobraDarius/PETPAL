package com.example.petpal.service;

import com.example.petpal.entity.ChatMessage;

public interface ChatService {
    void saveMessage(ChatMessage message);
}