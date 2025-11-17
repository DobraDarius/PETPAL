package com.example.petpal.service;

import com.example.petpal.entity.Pet;
import java.util.List;

public interface PetService {

    // CRUD
    Pet addPet(Pet pet);
    Pet updatePet(String id, Pet updatedPet);
    void deletePet(String id);
    Pet getPetById(String id);
    List<Pet> getAllPets();

    // Search
    List<Pet> searchPets(String type, String breed, Integer minAge, Integer maxAge, String location);

    // Images
    void addImagesToPet(String petId, List<String> imageUrls);

    // Owner
    List<Pet> getPetsByOwner(String ownerId);
}
