package com.example.petpal.service.impl;

import com.example.petpal.entity.Pet;
import com.example.petpal.service.PetService;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PetServiceImpl implements PetService {

    private final Firestore db;

    public PetServiceImpl(Firestore db) {
        this.db = db;
    }

    private CollectionReference pets() {
        return db.collection("pets");
    }

    @Override
    public Pet addPet(Pet pet) {
        try {
            // 1. Generate ID
            String id = pets().document().getId();
            pet.setId(id);

            // 2. Safety Checks
            if (pet.getImages() == null) pet.setImages(new ArrayList<>());
            if (pet.getAdoptionStatus() == null) pet.setAdoptionStatus("AVAILABLE");

            // 3. ✅ CRITICAL FIX: Add .get() to wait for confirmation
            // This will throw an exception if the file is too big (>1MB)
            pets().document(id).set(pet).get();

            return pet;
        } catch (Exception e) {
            // Now you will actually see the error in the console!
            e.printStackTrace();
            throw new RuntimeException("Failed to save pet to Firestore: " + e.getMessage());
        }
    }

    @Override
    public Pet updatePet(String id, Pet updatedPet) {
        updatedPet.setId(id);
        pets().document(id).set(updatedPet);
        return updatedPet;
    }

    @Override
    public void deletePet(String id) {
        pets().document(id).delete();
    }

    @Override
    public Pet getPetById(String id) {
        try {
            return pets().document(id).get().get().toObject(Pet.class);
        } catch (Exception e) {
            System.err.println("Error fetching pet " + id + ": " + e.getMessage());
            return null;
        }
    }

    // ✅ FIXED: Safe fetching that skips "bad" documents
    @Override
    public List<Pet> getAllPets() {
        try {
            List<QueryDocumentSnapshot> documents = pets().get().get().getDocuments();
            return documents.stream()
                    .map(doc -> {
                        try {
                            return doc.toObject(Pet.class);
                        } catch (Exception e) {
                            // Log error but DON'T crash the whole list
                            System.err.println("⚠️ Skipping corrupt pet document: " + doc.getId());
                            return null;
                        }
                    })
                    .filter(Objects::nonNull) // Remove the nulls (bad docs)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public List<Pet> searchPets(String type, String breed, Integer minAge, Integer maxAge, String location) {
        return getAllPets().stream()
                .filter(p -> type == null || (p.getType() != null && p.getType().equalsIgnoreCase(type)))
                .filter(p -> breed == null || (p.getBreed() != null && p.getBreed().equalsIgnoreCase(breed)))
                .filter(p -> minAge == null || (p.getAge() != null && p.getAge() >= minAge))
                .filter(p -> maxAge == null || (p.getAge() != null && p.getAge() <= maxAge))
                .collect(Collectors.toList());
    }

    @Override
    public void addImagesToPet(String id, List<String> urls) {
        Pet pet = getPetById(id);
        if (pet != null) {
            if (pet.getImages() == null) {
                pet.setImages(new ArrayList<>());
            }
            pet.getImages().addAll(urls);
            pets().document(id).set(pet);
        }
    }

    @Override
    public List<Pet> getPetsByOwner(String ownerId) {
        return getAllPets().stream()
                .filter(p -> ownerId != null && ownerId.equals(p.getOwnerId()))
                .collect(Collectors.toList());
    }
}