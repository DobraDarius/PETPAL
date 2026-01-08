import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaPlus, FaTrash, FaPen, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // UI States
    const [showMenu, setShowMenu] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        ageRange: "", // Renamed to ageRange for clarity
        gender: "",
        color: ""
    });

    const handleLogout = async () => {
        try { await logout(); navigate("/login"); }
        catch (error) { console.error("Logout failed:", error); }
    };

    useEffect(() => {
        const q = query(collection(db, "pets"), where("adopted", "==", false));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const petsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPets(petsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (e, petId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure? This will remove the listing permanently.")) {
            await deleteDoc(doc(db, "pets", petId));
        }
    };

    const handleEdit = (e, petId) => {
        e.stopPropagation();
        navigate(`/edit-pet/${petId}`);
    };

    // --- FILTER LOGIC ---
    const filteredPets = pets.filter((pet) => {
        // 1. Search
        const term = search.toLowerCase();
        const pName = pet.name ? pet.name.toLowerCase() : "";
        const pBreed = pet.breed ? pet.breed.toLowerCase() : "";
        const matchSearch = pName.includes(term) || pBreed.includes(term);

        // 2. Standard Filters
        const matchType = filters.type ? pet.type === filters.type : true;
        const matchGender = filters.gender ? pet.gender === filters.gender : true;
        const matchColor = filters.color ? (pet.color && pet.color.toLowerCase().includes(filters.color.toLowerCase())) : true;

        // 3. NUMERIC AGE RANGE LOGIC
        let matchAge = true;
        if (filters.ageRange) {
            const ageNum = parseInt(pet.age); // Convert stored string "2" to number 2

            // If data is invalid (NaN), don't show it when a filter is active
            if (isNaN(ageNum)) {
                matchAge = false;
            } else {
                if (filters.ageRange === "0-1") matchAge = (ageNum >= 0 && ageNum <= 1);
                else if (filters.ageRange === "2-5") matchAge = (ageNum >= 2 && ageNum <= 5);
                else if (filters.ageRange === "6-10") matchAge = (ageNum >= 6 && ageNum <= 10);
                else if (filters.ageRange === "10+") matchAge = (ageNum > 10);
            }
        }

        return matchSearch && matchType && matchAge && matchGender && matchColor;
    });

    const clearFilters = () => {
        setFilters({ type: "", ageRange: "", gender: "", color: "" });
        setSearch("");
    };

    const activeFilterCount = [filters.type, filters.ageRange, filters.gender, filters.color].filter(Boolean).length;

    return (
        <div className="adopter-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="title">🐾 PetPal</h1>
                    <p className="subtitle">Find your new best friend.</p>
                </div>
                <div className="header-right" style={{ display:'flex', gap:'15px', alignItems:'center' }}>
                    <button className="add-pet-btn-modern" onClick={() => navigate("/add-pet")}>
                        <FaPlus /> List a Pet
                    </button>
                    <div style={{ position: 'relative' }}>
                        <FaUserCircle className="profile-icon" onClick={() => setShowMenu(!showMenu)} />
                        {showMenu && (
                            <div className="profile-dropdown">
                                <p style={{ fontSize: '0.9rem', marginBottom:'10px', color:'#555'}}>{user?.email}</p>
                                <hr />
                                <button onClick={handleLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* --- CONTROLS --- */}
            <div className="controls-wrapper">

                <div className="search-header-row">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search name or breed..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        className={`filter-toggle-btn ${showFilters || activeFilterCount > 0 ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter />
                        <span className="btn-text">Filters</span>
                        {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>

                {showFilters && (
                    <div className="filters-panel">
                        <select className="modern-select" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
                            <option value="">All Types</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Rabbit">Rabbit</option>
                            <option value="Bird">Bird</option>
                            <option value="Hamster">Hamster</option>
                        </select>

                        {/* UPDATED AGE SELECT */}
                        <select className="modern-select" value={filters.ageRange} onChange={(e) => setFilters({...filters, ageRange: e.target.value})}>
                            <option value="">Any Age</option>
                            <option value="0-1">0 - 1 year</option>
                            <option value="2-5">2 - 5 years</option>
                            <option value="6-10">6 - 10 years</option>
                            <option value="10+">10+ years</option>
                        </select>

                        <select className="modern-select" value={filters.gender} onChange={(e) => setFilters({...filters, gender: e.target.value})}>
                            <option value="">Any Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <select className="modern-select" value={filters.color} onChange={(e) => setFilters({...filters, color: e.target.value})}>
                            <option value="">Any Color</option>
                            <option value="Black">Black</option>
                            <option value="White">White</option>
                            <option value="Brown">Brown</option>
                            <option value="Golden">Golden</option>
                            <option value="Grey">Grey</option>
                            <option value="Spotted">Spotted</option>
                        </select>

                        {(activeFilterCount > 0 || search) && (
                            <button className="clear-filters-btn" onClick={clearFilters} title="Clear Filters">
                                <FaTimes />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* --- GRID --- */}
            <h2 className="section-title">
                Results <span style={{fontSize:'0.6em', color:'#888'}}>({filteredPets.length})</span>
            </h2>

            {loading ? <p>Loading...</p> : (
                <div className="cards-container">
                    {filteredPets.length === 0 ? (
                        <div style={{ width:'100%', textAlign:'center', marginTop:'40px', color:'#888' }}>
                            <h3>No pets found. 🐶</h3>
                            <p>Try changing your filters.</p>
                        </div>
                    ) : (
                        filteredPets.map((pet) => {
                            const isOwner = user && pet.ownerId === user.uid;
                            return (
                                <div key={pet.id} className="pet-card" onClick={() => navigate(`/pet/${pet.id}`)}>
                                    {isOwner && <div className="owner-badge">MY LISTING</div>}
                                    <div className="image-wrapper">
                                        <img src={pet.image} alt={pet.name} onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=No+Image'}} />
                                    </div>
                                    <div className="pet-info">
                                        <div className="pet-header">
                                            <h3>{pet.name}</h3>
                                            <span className="pet-breed-pill">{pet.type}</span>
                                        </div>
                                        {/* Display 'years' after the age number */}
                                        <p className="pet-subtext">{pet.breed} • {pet.age} years • {pet.gender}</p>

                                        {isOwner ? (
                                            <div className="action-buttons">
                                                <button className="edit-btn" onClick={(e) => handleEdit(e, pet.id)}><FaPen /></button>
                                                <button className="delete-btn" onClick={(e) => handleDelete(e, pet.id)}><FaTrash /></button>
                                            </div>
                                        ) : (
                                            <button className="details-btn">Meet {pet.name}</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;