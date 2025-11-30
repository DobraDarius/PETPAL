import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PetDetailsPage.css";

const mockPets = [
    {
        id: "1",
        name: "Rex",
        breed: "Husky",
        age: "2 years",
        image: "https://place-puppy.com/500x500",
        description: "Energetic, friendly and playful. Great with kids."
    },
    {
        id: "2",
        name: "Luna",
        breed: "Siamese",
        age: "1 year",
        image: "https://placekitten.com/500/500",
        description: "Calm, affectionate cat who enjoys company."
    }
];

const PetDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Găsim animalul după ID
    const pet = mockPets.find((p) => p.id === id);

    if (!pet) return <h2>Pet not found</h2>;

    return (
        <div className="details-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="details-card">
                <img src={pet.image} className="details-image" alt={pet.name} />

                <div className="details-info">
                    <h1>{pet.name}</h1>
                    <p className="details-breed">{pet.breed}</p>
                    <p className="details-age">{pet.age}</p>

                    <p className="details-description">{pet.description}</p>

                    <button className="contact-btn">Contact Shelter</button>
                    <button className="chat-btn">Start Chat</button>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsPage;
