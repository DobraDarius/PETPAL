import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Ensure path is correct
import { FaPen, FaTrash } from "react-icons/fa";
import ChatComponent from './ChatComponent';

const PetCard = ({ pet, currentUserId }) => {
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);

    // 1. Check ownership
    // Convert both to String to ensure "5" equals 5
    const isOwner = currentUserId && String(pet.ownerId) === String(currentUserId);

    // 2. Handle Delete Logic (Moved from HomePage)
    const handleDelete = async (e) => {
        e.stopPropagation(); // Stop clicking the card from opening details
        if (window.confirm("Are you sure? This will remove the listing permanently.")) {
            try {
                await deleteDoc(doc(db, "pets", pet.id));
                // The HomePage onSnapshot will automatically update the UI
            } catch (error) {
                console.error("Error deleting pet:", error);
                alert("Failed to delete pet.");
            }
        }
    };

    // 3. Handle Edit Logic
    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/edit-pet/${pet.id}`);
    };

    return (
        <div style={{
            ...styles.card,
            width: showChat ? '300px' : '260px',
            borderColor: isOwner ? '#3b82f6' : 'transparent', // Blue border for your own pets
            borderWidth: isOwner ? '2px' : '0px',
            borderStyle: isOwner ? 'solid' : 'none'
        }}>
            {/* Owner Badge */}
            {isOwner && <div style={styles.ownerBadge}>MY LISTING</div>}

            <img
                // 1. Try the pet image first. If missing, use a reliable placeholder immediately.
                src={pet.image || "https://placehold.co/300x200?text=No+Image"}
                alt={pet.name}
                style={styles.image}
                // 2. If the real image fails to load, fallback to the placeholder
                onError={(e) => {
                    e.target.onerror = null; // Prevents infinite loop if placeholder also fails
                    e.target.src = "https://placehold.co/300x200?text=No+Image";
                }}
            />

            <div style={styles.info}>
                <h3 style={styles.name}>{pet.name}</h3>
                <p style={styles.details}>
                    {/* Only add 'years' if the age is just a number */}
                    {pet.type} • {pet.breed} • {pet.age} {(!isNaN(pet.age)) ? "years" : ""}
                </p>

                {/* --- BUTTON AREA --- */}
                <div style={styles.buttonGroup}>
                    {/* Always show Details */}
                    <button
                        style={styles.detailsButton}
                        onClick={() => navigate(`/pet/${pet.id}`)}
                    >
                        Details
                    </button>

                    {/* IF OWNER: Show Edit/Delete. IF VISITOR: Show Chat. */}
                    {isOwner ? (
                        <>
                            <button style={styles.editButton} onClick={handleEdit} title="Edit">
                                <FaPen />
                            </button>
                            <button style={styles.deleteButton} onClick={handleDelete} title="Delete">
                                <FaTrash />
                            </button>
                        </>
                    ) : (
                        <button
                            style={{
                                ...styles.chatButton,
                                backgroundColor: showChat ? '#ef4444' : '#10b981'
                            }}
                            onClick={() => setShowChat(!showChat)}
                        >
                            {showChat ? 'Close' : 'Chat'}
                        </button>
                    )}
                </div>

                {/* The Chat Interface (Only for visitors) */}
                {showChat && !isOwner && (
                    <div style={styles.chatContainer}>
                        <ChatComponent
                            currentUserId={currentUserId}
                            receiverId={pet.ownerId}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    card: {
        width: '260px',
        borderRadius: '15px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        position: 'relative', // For the badge positioning
        height: 'fit-content'
    },
    ownerBadge: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '10px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    },
    info: {
        padding: '15px',
        textAlign: 'center',
    },
    name: {
        margin: '0 0 5px 0',
        color: '#333',
        fontSize: '1.2rem'
    },
    details: {
        color: '#777',
        fontSize: '0.9rem',
        marginBottom: '15px',
        fontWeight: '500'
    },
    buttonGroup: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        marginBottom: '5px'
    },
    detailsButton: {
        flex: 2, // Details button takes up more space
        padding: '8px 0',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    chatButton: {
        flex: 2,
        padding: '8px 0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    // Smaller square buttons for Edit/Delete
    editButton: {
        flex: 1,
        padding: '8px 0',
        backgroundColor: '#fbbf24', // Amber/Yellow
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButton: {
        flex: 1,
        padding: '8px 0',
        backgroundColor: '#ef4444', // Red
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatContainer: {
        borderTop: '1px solid #eee',
        marginTop: '10px',
        paddingTop: '10px',
        height: '300px',
    }
};

export default PetCard;