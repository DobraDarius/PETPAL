import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import "./AddPetPage.css";

const AddPetPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "", breed: "", age: "", type: "Dog",
        gender: "Male", color: "", description: "",
        adoptionStatus: "AVAILABLE",
        shelterEmail: user?.email || ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ NEW SETTINGS: More aggressive compression
    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    // 👇 Reduced from 800 to 600 for safety
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // 👇 Reduced quality to 0.5 (50%) to save space
                    resolve(canvas.toDataURL('image/jpeg', 0.5));
                };
            };
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);

        // ⛔ LIMIT: Prevent uploading more than 3 images total
        if (images.length + files.length > 3) {
            alert("You can only upload a maximum of 3 photos.");
            return;
        }

        const resizedImages = [];

        for (const file of files) {
            try {
                const base64 = await resizeImage(file);
                // Check if a single image is somehow massive (unlikely now)
                if (base64.length > 500000) {
                    alert(`Skipping ${file.name} because it is too large even after compression.`);
                    continue;
                }
                resizedImages.push(base64);
            } catch (err) {
                console.error("Error resizing image", err);
            }
        }

        setImages((prev) => [...prev, ...resizedImages]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const petData = {
                ...formData,
                age: parseInt(formData.age),
                ownerId: user.uid,
                imageUrl: images[0] || "",
                images: images
            };

            await axios.post("http://localhost:8080/pets", petData);
            alert("Pet added successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error adding pet:", error);
            alert("Failed to add pet. The photos might still be too large.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-pet-container">
            <div className="form-wrapper">
                <h2>Add a New Pet 🐾</h2>
                <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <input name="name" placeholder="Pet Name" onChange={handleChange} required />
                        <input name="breed" placeholder="Breed" onChange={handleChange} required />
                    </div>

                    <div className="form-row three-cols">
                        <input name="age" type="number" placeholder="Age" onChange={handleChange} required />

                        <div className="select-container">
                            <select name="type" onChange={handleChange} value={formData.type}>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="select-container">
                            <select name="gender" onChange={handleChange} value={formData.gender}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="image-upload-section">
                        <label className="upload-btn">
                            <FaCloudUploadAlt size={20} />
                            <span>Upload Photos (Max 3)</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>

                        {images.length > 0 && (
                            <div className="preview-grid">
                                {images.map((img, index) => (
                                    <div key={index} className="preview-card">
                                        <img src={img} alt="preview" />
                                        <button type="button" onClick={() => removeImage(index)}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <textarea name="description" placeholder="Tell us about the pet..." onChange={handleChange} required />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Saving..." : "List Pet"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPetPage;