import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMars, FaVenus, FaRegImage } from 'react-icons/fa';
import './PetCard.css';

const PetCard = ({ pet }) => {
    const navigate = useNavigate();

    // SMART IMAGE LOGIC:
    let mainImage = null;

    // 1. Try new 'images' list
    if (pet.images && pet.images.length > 0) {
        mainImage = pet.images[0];
    }
    // 2. Fallback to old 'imageUrl'
    else if (pet.imageUrl) {
        mainImage = pet.imageUrl;
    }

    // 3. Safety Check: If the image string is suspiciously short or just "null", ignore it
    if (mainImage && mainImage.length < 50) {
        mainImage = null;
    }

    return (
        <div className="pet-card" onClick={() => navigate(`/pet/${pet.id}`)}>
            <div className="pet-image-container">
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={pet.name}
                        className="pet-image"
                        onError={(e) => {
                            // If image fails, hide the broken icon and show the placeholder div instead
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}

                {/* This Placeholder shows if mainImage is null OR if the img tag errors out */}
                <div
                    className="no-image-placeholder"
                    style={{ display: mainImage ? 'none' : 'flex' }}
                >
                    <FaRegImage size={40} color="#cbd5e1" />
                </div>
            </div>

            <div className="pet-info">
                <div className="pet-header">
                    <h3 className="pet-name">{pet.name}</h3>
                    <span className="gender-icon">
                        {pet.gender === 'Male' ? <FaMars color="#3b82f6"/> : <FaVenus color="#ec4899"/>}
                    </span>
                </div>
                <div className="pet-details">
                    <span className="pet-breed">{pet.breed}</span>
                    <span className="pet-age-dot">•</span>
                    <span className="pet-age">{pet.age} years</span>
                </div>
            </div>
        </div>
    );
};

export default PetCard;