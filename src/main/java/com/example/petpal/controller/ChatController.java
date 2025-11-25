package com.example.petpal.controller;

import com.example.petpal.entity.ChatMessage;
import com.example.petpal.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatService chatService;

    // Frontend sends to: /app/chat
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {

        // 1. Save to Database (Firestore)
        chatService.saveMessage(chatMessage);

        // 2. Send to the specific receiver
        // The frontend for the receiver should subscribe to: /topic/messages/{receiverId}
        messagingTemplate.convertAndSend(
                "/topic/messages/" + chatMessage.getReceiverId(),
                chatMessage
        );

    }
}