import React from 'react';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ pet }) => {
    const navigate = useNavigate();

    return (
        <div
            className="pet-card"
            onClick={() => navigate(`/pet/${pet.id}`)}
            style={{ cursor: 'pointer' }}
        >
            <img src={pet.image} alt={pet.name} className="pet-image" />
            <div className="pet-info">
                <h3>{pet.name}</h3>
                <p>{pet.breed} • {pet.age}</p>
                <button className="details-btn">View Details</button>
            </div>
        </div>
    );
};

export default PetCard;
