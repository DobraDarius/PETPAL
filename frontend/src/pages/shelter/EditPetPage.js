import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./AddPetPage.css"; // Refolosim stilul de la Add Page ca să arate la fel

const EditPetPage = () => {
    const { id } = useParams(); // Luăm ID-ul animalului din URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State inițial gol
    const [pet, setPet] = useState({
        name: "",
        type: "",
        breed: "",
        age: "",
        description: "",
        image: ""
    });

    const petTypes = ["Dog", "Cat", "Hamster", "Rabbit", "Parrot", "Other"];

    // 1. ÎNCĂRCĂM DATELE EXISTENTE CÂND DESCHIDEM PAGINA
    useEffect(() => {
        const fetchPet = async () => {
            try {
                const docRef = doc(db, "pets", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPet(docSnap.data()); // Punem datele din Firebase în formular
                } else {
                    setError("Pet not found!");
                }
            } catch (err) {
                console.error("Error fetching pet:", err);
                setError("Could not load pet details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPet();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    // 2. SALVĂM MODIFICĂRILE (UPDATE)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const docRef = doc(db, "pets", id);
            await updateDoc(docRef, pet); // updateDoc modifică doar câmpurile trimise

            console.log("Pet updated!");
            navigate("/"); // Ne întoarcem la Dashboard
        } catch (err) {
            console.error("Error updating pet:", err);
            setError("Failed to update pet details.");
            setLoading(false);
        }
    };

    if (loading) return <div className="addpet-container"><p>Loading details...</p></div>;

    return (
        <div className="addpet-container">
            <div className="addpet-card">
                <h1 className="addpet-title">✏️ Edit Pet Details</h1>

                {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

                <form className="addpet-form" onSubmit={handleUpdate}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Pet's Name"
                        value={pet.name}
                        onChange={handleChange}
                        required
                    />

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
                        placeholder="Age (e.g., 2 years)"
                        value={pet.age}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description..."
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
                    />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>

                <button className="back-btn" type="button" onClick={() => navigate(-1)}>
                    ← Cancel
                </button>
            </div>
        </div>
    );
};

export default EditPetPage;