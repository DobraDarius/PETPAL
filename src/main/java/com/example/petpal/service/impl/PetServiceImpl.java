package com.example.petpal.service.impl;

import com.example.petpal.entity.Pet;
import com.example.petpal.entity.PetImage;
import com.example.petpal.repository.PetRepository;
import com.example.petpal.repository.PetImageRepository;
import com.example.petpal.repository.UserRepository;
import com.example.petpal.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PetImageRepository petImageRepository;

    @Autowired
    private UserRepository userRepository;


    // ------------------ CREATE ------------------
    @Override
    public Pet addPet(Pet pet) {
        return petRepository.save(pet);
    }


    // ------------------ UPDATE ------------------
    @Override
    public Pet updatePet(Long id, Pet updatedPet) {

        Pet existing = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        existing.setName(updatedPet.getName());
        existing.setType(updatedPet.getType());
        existing.setBreed(updatedPet.getBreed());
        existing.setAge(updatedPet.getAge());
        existing.setDescription(updatedPet.getDescription());

        // This replaces setStatus()
        existing.setAdoptionStatus(updatedPet.getAdoptionStatus());

        // This replaces setLocation() — because Pet has no location field.

        // Replace main image if provided
        existing.setImageUrl(updatedPet.getImageUrl());

        return petRepository.save(existing);
    }


    // ------------------ DELETE ------------------
    @Override
    public void deletePet(Long id) {
        if (!petRepository.existsById(id)) {
            throw new RuntimeException("Pet not found");
        }
        petRepository.deleteById(id);
    }


    // ------------------ GET BY ID ------------------
    @Override
    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
    }


    // ------------------ GET ALL ------------------
    @Override
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }


    // ------------------ SEARCH ------------------
    @Override
    public List<Pet> searchPets(String type, String breed, Integer minAge, Integer maxAge, String location) {
        return petRepository.searchPets(type, breed, minAge, maxAge);
    }



    // ------------------ IMAGES: ADD ------------------
    @Override
    public void addImagesToPet(Long petId, List<String> imageUrls) {

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        for (String url : imageUrls) {
            PetImage image = new PetImage();
            image.setImageUrl(url);
            image.setPet(pet);

            pet.getImages().add(image);
        }

        petRepository.save(pet);
    }


    // ------------------ IMAGES: DELETE ------------------
    @Override
    public void deleteImage(Long imageId) {

        PetImage img = petImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        petImageRepository.delete(img);
    }


    // ------------------ OWNER PETS ------------------
    @Override
    public List<Pet> getPetsByOwner(Long ownerId) {

        if (!userRepository.existsById(ownerId)) {
            throw new RuntimeException("Owner not found");
        }

        return petRepository.findByOwnerId(ownerId);
    }
}
