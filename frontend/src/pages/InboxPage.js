import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChatComponent from '../components/ChatComponent';
import { FaUserCircle, FaCommentDots } from 'react-icons/fa';
import './InboxPage.css';

const InboxPage = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);

    // ✅ Change 1: Store the entire contact OBJECT (id + name), not just the ID string
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        if (user) {
            fetchContacts();
        }
    }, [user]);

    const fetchContacts = async () => {
        try {
            // This now returns a list of objects: [{id: "...", name: "Pablo"}, ...]
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
                        // ✅ Change 2: Map over objects
                        contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className={`contact-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
                                onClick={() => setSelectedContact(contact)} // Save the whole object
                            >
                                <FaUserCircle size={32} color="#cbd5e1" />
                                <div className="contact-info">
                                    {/* ✅ Change 3: Display the Real Name */}
                                    <span className="contact-name">
                                        {contact.name || "Unknown User"}
                                    </span>
                                    <span className="contact-subtext">Click to read chat</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT CHAT AREA */}
            <div className="inbox-chat-area">
                {selectedContact ? (
                    <>
                        <div className="chat-header-bar">
                            <FaUserCircle size={24} color="#3b82f6" />
                            {/* ✅ Change 4: Show name in header */}
                            <b>{selectedContact.name}</b>
                        </div>

                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            {/* ✅ Change 5: Pass the ID to the chat component */}
                            <ChatComponent
                                currentUserId={user.uid}
                                receiverId={selectedContact.id}
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