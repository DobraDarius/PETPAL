import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import PetCard from "../../components/PetCard";
import { useNavigate } from "react-router-dom"; // Import pentru navigare (logout)
import { useAuth } from "../../context/AuthContext"; // Import pentru Auth
import { FaUserCircle } from "react-icons/fa"; // Import iconiță profil
import "./AdopterDashboard.css";

const AdopterDashboard = () => {
    // 1. Hook-uri pentru Logout și User
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for filtering
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        age: "",
    });

    // 2. Funcția de Logout
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login"); // Redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // 3. Reading Data
    useEffect(() => {
        const q = query(collection(db, "pets"), where("adopted", "==", false));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const petsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPets(petsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredPets = pets.filter((pet) => {
        const term = search.toLowerCase();

        const matchSearch =
            pet.name.toLowerCase().includes(term) ||
            pet.breed.toLowerCase().includes(term) ||
            (pet.type && pet.type.toLowerCase().includes(term));

        const matchType = filters.type
            ? pet.type && pet.type.toLowerCase() === filters.type.toLowerCase()
            : true;

        const matchAge = true; // Add age logic here if needed later

        return matchSearch && matchType && matchAge;
    });

    return (
        <div className="adopter-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="title">🐾 Find Your Perfect Friend</h1>
                    <p className="subtitle">
                        Explore pets available for adoption from all shelters.
                    </p>
                </div>

                {/* --- AICI AM ADĂUGAT SECȚIUNEA DE PROFIL/LOGOUT --- */}
                <div className="header-right" style={{ position: 'relative' }}>
                    <FaUserCircle
                        className="profile-icon"
                        onClick={() => setShowMenu(!showMenu)}
                        title={user?.email}
                    />
                    {showMenu && (
                        <div className="profile-dropdown">
                            <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '10px' }}>
                                {user?.email}
                            </p>
                            <hr style={{ margin: '5px 0', border: '0', borderTop: '1px solid #eee' }} />
                            <button onClick={handleLogout}>Log Out</button>
                        </div>
                    )}
                </div>
            </header>

            {/* SEARCH BAR */}
            <div className="search-section">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name, breed..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* FILTERS */}
            <div className="filters-container">
                <select
                    className="filter-select"
                    value={filters.type}
                    onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                    }
                >
                    <option value="">All Types</option>
                    <option value="Dog">Dogs</option>
                    <option value="Cat">Cats</option>
                    <option value="Hamster">Hamsters</option>
                    <option value="Rabbit">Rabbits</option>
                    <option value="Parrot">Parrots</option>
                </select>

                <select
                    className="filter-select"
                    value={filters.age}
                    onChange={(e) =>
                        setFilters({ ...filters, age: e.target.value })
                    }
                >
                    <option value="">Any Age</option>
                    <option value="puppy">Puppy</option>
                    <option value="adult">Adult</option>
                    <option value="senior">Senior</option>
                </select>
            </div>

            {/* PET LIST */}
            <h2 className="section-title">
                Available Pets ({filteredPets.length}) 🐶🐱
            </h2>

            {loading ? (
                <p>Loading pets...</p>
            ) : filteredPets.length === 0 ? (
                <p>No pets matched your criteria. :(</p>
            ) : (
                <div className="cards-container">
                    {filteredPets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdopterDashboard;