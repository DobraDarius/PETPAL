package com.example.petpal.service.impl;

import com.example.petpal.entity.Pet;
import com.example.petpal.service.PetService;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.util.List;
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
        String id = pets().document().getId();
        pet.setId(id);
        pets().document(id).set(pet);
        return pet;
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
            throw new RuntimeException("Pet not found");
        }
    }

    @Override
    public List<Pet> getAllPets() {
        try {
            return pets().get().get().getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(Pet.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Cannot fetch pets");
        }
    }

    @Override
    public List<Pet> searchPets(String type, String breed, Integer minAge, Integer maxAge, String location) {
        return getAllPets().stream()
                .filter(p -> type == null || p.getType().equalsIgnoreCase(type))
                .filter(p -> breed == null || p.getBreed().equalsIgnoreCase(breed))
                .filter(p -> minAge == null || p.getAge() >= minAge)
                .filter(p -> maxAge == null || p.getAge() <= maxAge)
                .collect(Collectors.toList());
    }

    @Override
    public void addImagesToPet(String id, List<String> urls) {
        Pet pet = getPetById(id);
        pet.getImages().addAll(urls);
        pets().document(id).set(pet);
    }

    @Override
    public List<Pet> getPetsByOwner(String ownerId) {
        return getAllPets().stream()
                .filter(p -> ownerId.equals(p.getOwnerId()))
                .collect(Collectors.toList());
    }
}
