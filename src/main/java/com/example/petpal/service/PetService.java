package com.example.petpal.service;

import com.example.petpal.entity.Pet;

import java.util.List;

public interface PetService {

    // --- PET CRUD ---
    Pet addPet(Pet pet);
    Pet updatePet(Long id, Pet updatedPet);
    void deletePet(Long id);
    Pet getPetById(Long id);
    List<Pet> getAllPets();

    // --- SEARCH ---
    List<Pet> searchPets(String type, String breed, Integer minAge, Integer maxAge, String location);

    // --- IMAGES ---
    void addImagesToPet(Long petId, List<String> imageUrls);
    void deleteImage(Long imageId);

    // --- OWNER-SPECIFIC ---
    List<Pet> getPetsByOwner(Long ownerId);
}
