import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Importuri Firestore
import { db } from "../../firebase"; // ⚠️ Verifică calea către fișierul tău firebase.js
import { useAuth } from "../../context/AuthContext"; // Importăm contextul pentru a ști CINE adaugă animalul
import "./AddPetPage.css";

const AddPetPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Luăm userul curent ca să îi salvăm ID-ul ca proprietar
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Aici salvăm datele în colecția "pets" din Firestore
            await addDoc(collection(db, "pets"), {
                ...pet,
                ownerId: user.uid, // Foarte important: Legăm animalul de shelter-ul care l-a postat
                shelterEmail: user.email, // Opțional: salvăm și emailul pentru contact ușor
                adopted: false, // Implicit, animalul nu e adoptat încă
                createdAt: serverTimestamp() // Salvăm data și ora creării
            });

            console.log("Pet added successfully!");
            navigate("/"); // Ne întoarcem la Dashboard
        } catch (err) {
            console.error("Error adding pet:", err);
            setError("A apărut o eroare la salvarea datelor. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addpet-container">
            <div className="addpet-card">
                <h1 className="addpet-title">🐾 Add a New Pet for Adoption</h1>
                <p className="addpet-subtitle">
                    Complete all fields below to list your pet for adoption.
                </p>

                {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

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
                        placeholder="Image URL (ex: https://...)"
                        value={pet.image}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Saving..." : "Add Pet"}
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