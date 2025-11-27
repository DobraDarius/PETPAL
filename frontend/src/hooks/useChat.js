// src/hooks/useChat.js (Concept)
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const useChat = (conversationId) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!conversationId) return;

        const q = query(
            collection(db, 'chats', conversationId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, [conversationId]);

    return messages;
};

const sendMessage = async (conversationId, senderId, text) => {
    await addDoc(collection(db, 'chats', conversationId, 'messages'), {
        senderId,
        text,
        timestamp: serverTimestamp()
    });
};