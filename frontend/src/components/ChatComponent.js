import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './ChatComponent.css';

const ChatComponent = ({ currentUserId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");

    // We use a ref to keep the client instance persistent across renders
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // 1. Configure the STOMP Client
        const client = new Client({
            // Connect to your Spring Boot Backend
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

            // Reconnect automatically if the server restarts
            reconnectDelay: 5000,

            // Log connection status for debugging
            onConnect: () => {
                setConnectionStatus("Connected");
                console.log("Connected to WebSocket");

                // 2. Subscribe to YOUR personal topic
                // The backend sends messages to: /topic/messages/{userId}
                client.subscribe(`/topic/messages/${currentUserId}`, (message) => {
                    if (message.body) {
                        const receivedMsg = JSON.parse(message.body);

                        // Only display messages from the person we are currently chatting with
                        if (receivedMsg.senderId === receiverId) {
                            setMessages((prev) => [...prev, receivedMsg]);
                        }
                    }
                });
            },
            onDisconnect: () => {
                setConnectionStatus("Disconnected");
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            }
        });

        // 3. Activate the connection
        client.activate();
        clientRef.current = client;

        // Cleanup: Disconnect when the component closes
        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [currentUserId, receiverId]);

    const sendMessage = (e) => {
        e.preventDefault();

        if (newMessage.trim() && clientRef.current && clientRef.current.connected) {
            const chatMessage = {
                senderId: currentUserId,
                receiverId: receiverId,
                content: newMessage,
                timestamp: Date.now(),
                isRead: false
            };

            // 4. Send the message to the Backend Controller
            clientRef.current.publish({
                destination: "/app/chat",
                body: JSON.stringify(chatMessage),
            });

            // Optimistic Update (Show it immediately on our screen)
            setMessages((prev) => [...prev, chatMessage]);
            setNewMessage("");
        }
    };

    return (
        <div className="chat-container">
            {/* Optional: Connection Status Indicator */}
            <div style={{ fontSize: '0.75rem', textAlign: 'center', color: '#888', paddingBottom: '5px' }}>
                Status: {connectionStatus}
            </div>

            <div className="chat-box">
                {messages.length === 0 && (
                    <p style={{textAlign: 'center', color: '#aaa', fontSize: '0.9rem', marginTop: '20px'}}>
                        Say hello! 👋
                    </p>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
                    >
                        {msg.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" disabled={connectionStatus !== "Connected"}>➤</button>
            </form>
        </div>
    );
};

export default ChatComponent;