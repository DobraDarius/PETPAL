package com.example.petpal.entity;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ChatMessage {

    private String id;          // Firestore Document ID
    private String senderId;    // Matches User.id
    private String receiverId;  // Matches User.id
    private String content;
    private Long timestamp;
    private boolean isRead;
    private String senderName;

    public ChatMessage() {}
}