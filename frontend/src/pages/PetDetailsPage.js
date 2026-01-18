import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaEnvelope, FaComments, FaMars, FaVenus, FaTimes } from "react-icons/fa";
import ChatComponent from "../components/ChatComponent";
import "./PetDetailsPage.css";

const PetDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const docRef = doc(db, "pets", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPet({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching pet:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPet();
    }, [id]);

    const handleChat = () => {
        if (!user) {
            alert("You must be logged in to chat!");
            navigate("/login");
            return;
        }
        setShowChat(true);
    };

    if (loading) return <div className="details-loading">Loading details...</div>;
    if (!pet) return <div className="details-loading">Pet not found 😕</div>;

    const formatAge = (age) => {
        const num = parseInt(age);
        if (isNaN(num)) return age;
        return num === 1 ? "1 year" : `${num} years`;
    };

    const isOwner = user && String(user.uid) === String(pet.ownerId);

    return (
        <div className="details-container">
            <button className="back-btn-modern" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <div className="details-card">
                <div className="image-section">
                    <img
                        src={pet.image || "https://via.placeholder.com/400?text=No+Image"}
                        className="details-image"
                        alt={pet.name}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
                    />
                </div>

                <div className="info-section">
                    <div className="header-info">
                        <h1 className="pet-name">{pet.name}</h1>
                        <span className="pet-breed-badge">{pet.breed}</span>
                    </div>

                    <div className="tags-row">
                        <div className="info-tag">
                            <span className="label">Type</span>
                            <span className="value">{pet.type}</span>
                        </div>
                        <div className="info-tag">
                            <span className="label">Age</span>
                            <span className="value">{formatAge(pet.age)}</span>
                        </div>
                        <div className="info-tag">
                            <span className="label">Gender</span>
                            <span className="value">
                                {pet.gender === "Male" ? <FaMars color="#3b82f6"/> : <FaVenus color="#ec4899"/>}
                                {" "}{pet.gender}
                            </span>
                        </div>
                        <div className="info-tag">
                            <span className="label">Color</span>
                            <span className="value">{pet.color}</span>
                        </div>
                    </div>

                    <div className="story-section">
                        <h3>My Story</h3>
                        <p>{pet.description}</p>
                    </div>

                    <div className="action-buttons-row">
                        {!isOwner ? (
                            <>
                                <button className="action-btn chat-btn" onClick={handleChat}>
                                    <FaComments /> Chat with Owner
                                </button>

                                <a
                                    href={`mailto:${pet.shelterEmail}?subject=Adoption Inquiry: ${pet.name}`}
                                    className="action-btn email-btn"
                                >
                                    <FaEnvelope /> Send Email
                                </a>
                            </>
                        ) : (
                            <div style={{ color: '#6b7280', fontStyle: 'italic', marginTop: '10px' }}>
                                This is your listing
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- CHAT MODAL OVERLAY --- */}
            {showChat && !isOwner && (
                <div className="chat-modal-overlay">
                    <div className="chat-modal-content">
                        <div className="chat-modal-header">
                            <h3>Chat with {pet.name}'s Owner</h3>
                            {/* ✅ FIX: Added className "close-chat-btn" here */}
                            <button className="close-chat-btn" onClick={() => setShowChat(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="chat-modal-body">
                            <ChatComponent
                                currentUserId={user.uid}
                                receiverId={pet.ownerId}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetDetailsPage;