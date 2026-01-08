import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import "./AddPetPage.css";

const AddPetPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [pet, setPet] = useState({
        name: "",
        type: "Dog",
        breed: "",
        gender: "Male",
        age: "",   // Now this will be a number string like "2"
        color: "",
        description: "",
        image: ""
    });

    const petTypes = ["Dog", "Cat", "Rabbit", "Hamster", "Bird", "Other"];
    const genders = ["Male", "Female"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Default image logic
            let finalImage = pet.image;
            if (!finalImage) {
                if (pet.type === "Dog") finalImage = "https://place.dog/300/300";
                else if (pet.type === "Cat") finalImage = "https://placekitten.com/300/300";
                else finalImage = "https://via.placeholder.com/300?text=No+Image";
            }

            await addDoc(collection(db, "pets"), {
                ...pet,
                image: finalImage,
                ownerId: user.uid,
                shelterEmail: user.email,
                adopted: false,
                createdAt: serverTimestamp()
            });

            navigate("/");
        } catch (err) {
            console.error("Error adding pet:", err);
            setError("Error saving pet. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addpet-container">
            <div className="addpet-card">
                <h1 className="addpet-title">🐾 List a New Pet</h1>
                <p className="addpet-subtitle">Help them find a loving home.</p>

                {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

                <form className="addpet-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Pet Name"
                        value={pet.name}
                        onChange={handleChange}
                        required
                    />

                    {/* ROW 1: Type & Breed */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <select name="type" value={pet.type} onChange={handleChange} required>
                            {petTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                            type="text"
                            name="breed"
                            placeholder="Breed"
                            value={pet.breed}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* ROW 2: Age & Gender */}
                    <div style={{ display: 'flex', gap: '15px' }}>

                        {/* CHANGED: Number Input for Age */}
                        <input
                            type="number"
                            name="age"
                            placeholder="Age (years)"
                            min="0"
                            max="30"
                            value={pet.age}
                            onChange={handleChange}
                            required
                            style={{ flex: 1 }} // Ensures it takes equal width in flex row
                        />

                        <select name="gender" value={pet.gender} onChange={handleChange} required style={{ flex: 1 }}>
                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <input
                        type="text"
                        name="color"
                        placeholder="Color (e.g. Black, Golden)"
                        value={pet.color}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description (personality, story...)"
                        value={pet.description}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL (Optional)"
                        value={pet.image}
                        onChange={handleChange}
                    />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Publishing..." : "Publish Listing"}
                    </button>
                </form>

                <button className="back-btn" type="button" onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddPetPage;