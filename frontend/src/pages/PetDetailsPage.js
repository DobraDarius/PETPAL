import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Make sure the path is correct
import "./PetDetailsPage.css";

const PetDetailsPage = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                // Request the specific document from the "pets" collection by ID
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

    if (loading)
        return (
            <div className="details-container">
                <h2>Loading details...</h2>
            </div>
        );

    if (!pet)
        return (
            <div className="details-container">
                <h2>Pet not found :(</h2>
            </div>
        );

    return (
        <div className="details-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="details-card">
                <img
                    src={pet.image}
                    className="details-image"
                    alt={pet.name}
                    onError={(e) => {
                        e.target.src =
                            "https://via.placeholder.com/350?text=No+Image";
                    }}
                />

                <div className="details-info">
                    <h1>{pet.name}</h1>

                    <p className="details-breed">
                        <strong>Type:</strong> {pet.type}  {"  "}
                        <strong>Age:</strong> {pet.age}
                    </p>

                    <p className="details-type">
                        <strong>Breed:</strong> {pet.breed}
                    </p>

                    <h3>My Story:</h3>
                    <p className="details-description">{pet.description}</p>

                    <div className="contact-section">
                        <p>
                            <strong>Shelter Contact:</strong>{" "}
                            {pet.shelterEmail}
                        </p>
                        <button
                            className="contact-btn"
                            onClick={() =>
                                (window.location.href = `mailto:${pet.shelterEmail}`)
                            }
                        >
                            Send Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsPage;
