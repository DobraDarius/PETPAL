import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ChatComponent.css';

const ChatComponent = ({ currentUserId, receiverId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false); // ✅ Track connection status
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 1. Lifecycle: Connect on mount, Disconnect on unmount/change
    useEffect(() => {
        if (currentUserId && receiverId) {
            setMessages([]); // Clear old messages
            fetchHistory();
            connect();
        }
        return () => disconnect();
        // eslint-disable-next-line
    }, [currentUserId, receiverId]);

    // 2. Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/chat/history/${currentUserId}/${receiverId}`);
            setMessages(res.data);
        } catch (error) {
            console.error("Could not load history", error);
        }
    };

    const connect = () => {
        // Prevent multiple connections
        if (stompClientRef.current && stompClientRef.current.connected) return;

        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        // Optional: Turn off verbose console logs
        // client.debug = () => {};

        client.connect({}, () => {
            setIsConnected(true); // ✅ Connection established!

            client.subscribe(`/topic/messages/${currentUserId}`, (message) => {
                const receivedMsg = JSON.parse(message.body);
                if (receivedMsg.senderId === receiverId || receivedMsg.receiverId === receiverId) {
                    setMessages((prev) => [...prev, receivedMsg]);
                }
            });
        }, (error) => {
            console.error("Connection Error: ", error);
            setIsConnected(false);
        });

        stompClientRef.current = client;
    };

    const disconnect = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect(() => {
                console.log("Disconnected");
                setIsConnected(false);
            });
        }
    };

    const sendMessage = () => {
        // ✅ CRITICAL FIX: Check if connected before sending
        if (!isConnected || !stompClientRef.current) {
            console.warn("Chat not connected yet. Please wait.");
            return;
        }

        if (input.trim()) {
            const chatMessage = {
                senderId: currentUserId,
                receiverId: receiverId,
                content: input,
                timestamp: Date.now(),
                senderName: user.displayName || user.email || "User"
            };

            try {
                stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
                setMessages((prev) => [...prev, chatMessage]);
                setInput('');
            } catch (error) {
                console.error("Send failed:", error);
            }
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-messages">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={index} className={`message-bubble ${isMe ? 'my-message' : 'their-message'}`}>
                            {!isMe && (
                                <span className="message-sender">
                                    {msg.senderName || "Unknown"}
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
                    placeholder={isConnected ? "Type a message..." : "Connecting..."} // Visual Feedback
                    disabled={!isConnected} // Disable input while connecting
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} disabled={!isConnected}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;