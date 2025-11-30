import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPetPage.css";

const AddPetPage = () => {
    const navigate = useNavigate();

    const [pet, setPet] = useState({
        name: "",
        type: "",
        breed: "",
        age: "",
        description: "",
        image: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aici ar urma să trimiți datele către backend / Firebase
        console.log("Pet added:", pet);
        navigate("/"); // întoarcere la dashboard după submit
    };

    return (
        <div className="addpet-container">
            <div className="addpet-card">
                <h1 className="addpet-title">🐾 Add a New Pet for Adoption</h1>
                <p className="addpet-subtitle">
                    Complete all fields below to list your pet for adoption.
                </p>

                <form className="addpet-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Pet's Name"
                        value={pet.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="type"
                        placeholder="Type (Dog, Cat, Other)"
                        value={pet.type}
                        onChange={handleChange}
                        required
                    />
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
                        placeholder="Age (e.g., 2 years)"
                        value={pet.age}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Describe your pet..."
                        value={pet.description}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={pet.image}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="submit-btn">
                        Add Pet
                    </button>
                </form>

                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AddPetPage;
