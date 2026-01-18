package com.example.petpal.controller;

import com.example.petpal.entity.ChatMessage;
import com.example.petpal.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    // --- 1. WEBSOCKET (Sending Messages) ---
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        // Save to Database
        chatService.saveMessage(chatMessage);

        // Send to Receiver (Instant notification)
        messagingTemplate.convertAndSend(
                "/topic/messages/" + chatMessage.getReceiverId(),
                chatMessage
        );
    }

    // --- 2. REST API (Inbox)
    @GetMapping("/api/contacts/{userId}")
    @ResponseBody
    public ResponseEntity<List<String>> getContacts(@PathVariable String userId) {
        List<String> contacts = chatService.getInteractedUsers(userId);
        return ResponseEntity.ok(contacts);
    }

    // ✅ 3. NEW REST: Get Chat History
    @GetMapping("/api/chat/history/{user1}/{user2}")
    @ResponseBody
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String user1, @PathVariable String user2) {
        List<ChatMessage> history = chatService.getConversation(user1, user2);
        return ResponseEntity.ok(history);
    }
}