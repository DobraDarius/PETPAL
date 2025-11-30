import React, { useState } from "react";
import PetCard from "../../components/PetCard";
import "./AdopterDashboard.css";

const mockPets = [
    {
        id: "1",
        name: "Rex",
        breed: "Husky",
        age: "2 years",
        image: "https://place-puppy.com/300x300",
    },
    {
        id: "2",
        name: "Luna",
        breed: "Siamese",
        age: "1 year",
        image: "https://placekitten.com/300",
    },
];

const AdopterDashboard = () => {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        age: "",
    });

    // Filtrare și căutare simplă
    const filteredPets = mockPets.filter((pet) => {
        const matchSearch =
            pet.name.toLowerCase().includes(search.toLowerCase()) ||
            pet.breed.toLowerCase().includes(search.toLowerCase());
        const matchType = filters.type
            ? filters.type === "dog"
                ? pet.breed.toLowerCase().includes("dog")
                : filters.type === "cat"
                    ? pet.breed.toLowerCase().includes("cat")
                    : true
            : true;
        const matchAge = filters.age
            ? filters.age === "adult"
                ? pet.age.toLowerCase().includes("year")
                : true
            : true;
        return matchSearch && matchType && matchAge;
    });

    return (
        <div className="adopter-container">
            <header className="dashboard-header">
                <h1 className="title">🐾 Find Your New Best Friend</h1>
                <p className="subtitle">
                    Explore pets available for adoption from shelters near you.
                </p>
            </header>

            <div className="search-section">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search pets by name, breed, etc..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="filters-container">
                <select
                    className="filter-select"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="dog">Dogs</option>
                    <option value="cat">Cats</option>
                    <option value="other">Others</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.age}
                    onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                >
                    <option value="">Any Age</option>
                    <option value="puppy">Puppy / Kitten</option>
                    <option value="adult">Adult</option>
                    <option value="senior">Senior</option>
                </select>
            </div>

            <h2 className="section-title">Available Pets 🐶🐱</h2>

            <div className="cards-container">
                {filteredPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                ))}
            </div>
        </div>
    );
};

export default AdopterDashboard;
