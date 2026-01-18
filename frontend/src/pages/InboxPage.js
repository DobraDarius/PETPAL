import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChatComponent from '../components/ChatComponent';
import { FaUserCircle, FaCommentDots } from 'react-icons/fa';
import './InboxPage.css'; // <--- Import the CSS here

const InboxPage = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [selectedContactId, setSelectedContactId] = useState(null);

    useEffect(() => {
        if (user) {
            fetchContacts();
        }
    }, [user]);

    const fetchContacts = async () => {
        try {
            // Ensure this matches your Java Controller URL
            const res = await axios.get(`http://localhost:8080/api/contacts/${user.uid}`);
            setContacts(res.data);
        } catch (error) {
            console.error("Error loading inbox", error);
        }
    };

    return (
        <div className="inbox-container">
            {/* LEFT SIDEBAR */}
            <div className="inbox-sidebar">
                <h2 className="inbox-header">Inbox 📬</h2>
                <div className="contact-list">
                    {contacts.length === 0 ? (
                        <p style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
                            No messages yet.
                        </p>
                    ) : (
                        contacts.map((contactId) => (
                            <div
                                key={contactId}
                                className={`contact-item ${selectedContactId === contactId ? 'active' : ''}`}
                                onClick={() => setSelectedContactId(contactId)}
                            >
                                <FaUserCircle size={32} color="#cbd5e1" />
                                <div className="contact-info">
                                    <span className="contact-name">User: {contactId.substring(0, 6)}...</span>
                                    <span className="contact-subtext">Click to read chat</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div className="inbox-chat-area">
                {selectedContactId ? (
                    <>
                        <div className="chat-header-bar">
                            <FaUserCircle size={24} color="#3b82f6" />
                            <b>User {selectedContactId.substring(0, 6)}...</b>
                        </div>
                        {/* reusing your chat component */}
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <ChatComponent
                                currentUserId={user.uid}
                                receiverId={selectedContactId}
                            />
                        </div>
                    </>
                ) : (
                    <div className="inbox-placeholder">
                        <FaCommentDots size={60} color="#e5e7eb" />
                        <h3>Select a conversation</h3>
                        <p>Choose a contact from the left to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InboxPage;