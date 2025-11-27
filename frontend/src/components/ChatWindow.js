// src/components/ChatWindow.js (Schiță)
import React, { useState } from 'react';
import useChat from '../hooks/useChat';
import { sendMessage } from '../firebase/utils';
// Presupunem că ai ID-ul conversației și ID-ul utilizatorului tău
const CONVO_ID = "shelter_adopter_123";

function ChatWindow({ userId }) {
    const messages = useChat(CONVO_ID);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(CONVO_ID, userId, input);
            setInput('');
        }
    };

    return (
        <div>
            {/* Afișează mesaje */}
            <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc' }}>
                {messages.map(msg => (
                    <p key={msg.id}>
                        **{msg.senderId === userId ? 'Eu' : 'Partenerul'}**: {msg.text}
                    </p>
                ))}
            </div>

            {/* Formular de trimitere */}
            <form onSubmit={handleSend}>
                <input value={input} onChange={(e) => setInput(e.target.value)} />
                <button type="submit">Trimite</button>
            </form>
        </div>
    );
}