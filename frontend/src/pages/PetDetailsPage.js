import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaMars, FaVenus, FaEnvelope, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./PetDetailsPage.css";

const PetDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/pets/${id}`);
                setPet(res.data);
            } catch (err) {
                console.error("Error fetching pet details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [id]);

    const handleAdopt = () => {
        if (!user) {
            alert("Please log in to contact the owner.");
            navigate("/login");
            return;
        }
        // Navigate to inbox with the owner pre-selected (future feature)
        navigate("/inbox");
    };

    // ✅ IMAGE SLIDER LOGIC
    const nextImage = () => {
        if (!pet?.images) return;
        setCurrentImageIndex((prev) => (prev === pet.images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        if (!pet?.images) return;
        setCurrentImageIndex((prev) => (prev === 0 ? pet.images.length - 1 : prev - 1));
    };

    if (loading) return <div className="loading-screen">Loading details...</div>;
    if (!pet) return <div className="error-screen">Pet not found. 😕</div>;

    // Fallback if images list is empty
    const displayImages = (pet.images && pet.images.length > 0)
        ? pet.images
        : [pet.imageUrl || "https://via.placeholder.com/600?text=No+Image"];

    return (
        <div className="pet-details-container">

            <div className="details-wrapper">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>

                <div className="details-card">
                    {/* LEFT SIDE: IMAGE SLIDER */}
                    <div className="details-image-section">
                        <img
                            src={displayImages[currentImageIndex]}
                            alt={pet.name}
                            className="main-detail-image"
                        />

                        {/* Show arrows only if multiple images exist */}
                        {displayImages.length > 1 && (
                            <>
                                <button className="slider-arrow left" onClick={prevImage}>
                                    <FaChevronLeft />
                                </button>
                                <button className="slider-arrow right" onClick={nextImage}>
                                    <FaChevronRight />
                                </button>

                                <div className="slider-dots">
                                    {displayImages.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                                            onClick={() => setCurrentImageIndex(idx)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT SIDE: INFO */}
                    <div className="details-info-section">
                        <div className="details-header">
                            <h1>{pet.name}</h1>
                            <span className="breed-badge">{pet.breed}</span>
                        </div>

                        <div className="info-grid">
                            <div className="info-item">
                                <label>Type</label>
                                <p>{pet.type}</p>
                            </div>
                            <div className="info-item">
                                <label>Age</label>
                                <p>{pet.age} years</p>
                            </div>
                            <div className="info-item">
                                <label>Gender</label>
                                <p className="gender-row">
                                    {pet.gender}
                                    {pet.gender === 'Male' ? <FaMars color="#3b82f6"/> : <FaVenus color="#ec4899"/>}
                                </p>
                            </div>
                            <div className="info-item">
                                <label>Color</label>
                                <p>{pet.color || "N/A"}</p>
                            </div>
                        </div>

                        <div className="story-section">
                            <h3>My Story</h3>
                            <p>{pet.description}</p>
                        </div>

                        {/* Action Area */}
                        <div className="action-area">
                            {user?.uid === pet.ownerId ? (
                                <p className="owner-msg"><em>This is your listing</em></p>
                            ) : (
                                <button className="adopt-btn" onClick={handleAdopt}>
                                    <FaEnvelope /> Contact Owner
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsPage;