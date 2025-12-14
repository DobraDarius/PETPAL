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
        type: "Dog", // Default selected option
        breed: "",
        age: "",
        description: "",
        image: ""
    });

    // Options for the dropdown
    const petTypes = ["Dog", "Cat", "Hamster", "Rabbit", "Parrot", "Other"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // SMART LOGIC: If no image is provided, use a default one
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

            console.log("Pet added successfully!");
            navigate("/");
        } catch (err) {
            console.error("Error adding pet:", err);
            setError("There was an error. Please try again...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addpet-container">
            <div className="addpet-card">
                <h1 className="addpet-title">🐾 Add a New Pet</h1>
                <p className="addpet-subtitle">
                    Fill in the details to list the pet for adoption.
                </p>

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

                    {/* --- COMBOBOX (DROPDOWN) --- */}
                    <div className="select-container">
                        <label className="input-label">Pet Type:</label>
                        <select
                            name="type"
                            value={pet.type}
                            onChange={handleChange}
                            required
                        >
                            {petTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="text"
                        name="breed"
                        placeholder="Breed"
                        value={pet.breed}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="age"
                        placeholder="Age (e.g. 2 years)"
                        value={pet.age}
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

                    {/* IMAGE IS NOW OPTIONAL */}
                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL (Optional - leave empty for default)"
                        value={pet.image}
                        onChange={handleChange}
                    />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Saving..." : "Publish Listing"}
                    </button>
                </form>

                <button className="back-btn" type="button" onClick={() => navigate(-1)}>
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AddPetPage;
