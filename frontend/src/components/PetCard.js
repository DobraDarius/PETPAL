import React from 'react';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ pet }) => {
    const navigate = useNavigate();

    return (
        <div style={styles.card}>
            <img
                src={pet.image}
                alt={pet.name}
                style={styles.image}
                onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'}}
            />
            <div style={styles.info}>
                <h3 style={styles.name}>{pet.name}</h3>

                {/* AICI ESTE MODIFICAREA: Afișăm Tip • Rasă • Vârstă */}
                <p style={styles.details}>
                    {pet.type} • {pet.breed} • {pet.age}
                </p>

                <button
                    style={styles.button}
                    onClick={() => navigate(`/pet/${pet.id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        width: '260px',
        borderRadius: '15px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
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
    button: {
        width: '100%',
        padding: '10px 0',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s'
    }
};

export default PetCard;