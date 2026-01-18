import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ChatComponent.css';

const ChatComponent = ({ currentUserId, receiverId }) => {
    const { user } = useAuth(); // Get current user info
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // ✅ FIX 1 & 2: Fetch History & Reset when 'receiverId' changes
    useEffect(() => {
        if (currentUserId && receiverId) {
            setMessages([]); // Clear previous conversation first!
            fetchHistory();
            connect();
        }
        // Cleanup: Disconnect when switching users
        return () => disconnect();
    }, [currentUserId, receiverId]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchHistory = async () => {
        try {
            // Call the NEW backend endpoint
            const res = await axios.get(`http://localhost:8080/api/chat/history/${currentUserId}/${receiverId}`);
            setMessages(res.data);
        } catch (error) {
            console.error("Could not load history", error);
        }
    };

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/topic/messages/${currentUserId}`, (message) => {
                const receivedMsg = JSON.parse(message.body);
                // Only accept messages for THIS active conversation
                if (receivedMsg.senderId === receiverId || receivedMsg.receiverId === receiverId) {
                    setMessages((prev) => [...prev, receivedMsg]);
                }
            });
        }, (error) => console.error(error));

        stompClientRef.current = client;
    };

    const disconnect = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect();
        }
    };

    const sendMessage = () => {
        if (input.trim() && stompClientRef.current) {
            const chatMessage = {
                senderId: currentUserId,
                receiverId: receiverId,
                content: input,
                timestamp: Date.now(),
                // ✅ FIX 3: Send the Real Name (or Email/ID if name is missing)
                senderName: user.displayName || user.email || "User"
            };

            stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessages((prev) => [...prev, chatMessage]);
            setInput('');
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-messages">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={index} className={`message-bubble ${isMe ? 'my-message' : 'their-message'}`}>
                            {/* Show Name if it's not me */}
                            {!isMe && (
                                <span className="message-sender">
                                    {msg.senderName || "Unknown"} {/* Fallback for old messages */}
                                </span>
                            )}
                            <div className="message-content">{msg.content}</div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;