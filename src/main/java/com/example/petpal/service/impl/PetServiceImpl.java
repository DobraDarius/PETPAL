package com.example.petpal.service.impl;

import com.example.petpal.entity.Pet;
import com.example.petpal.repository.PetRepository;
import com.example.petpal.service.PetService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;

    public PetServiceImpl(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @Override
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @Override
    public Pet createPet(Pet pet) {
        return petRepository.save(pet);
    }

    @Override
    public Pet updatePet(Long id, Pet updatedPet) {
        Pet existing = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        existing.setName(updatedPet.getName());
        existing.setBreed(updatedPet.getBreed());
        existing.setType(updatedPet.getType());
        existing.setAge(updatedPet.getAge());
        existing.setDescription(updatedPet.getDescription());
        existing.setAdoptionStatus(updatedPet.getAdoptionStatus());

        return petRepository.save(existing);
    }

    @Override
    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }

    @Override
    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
    }
}
