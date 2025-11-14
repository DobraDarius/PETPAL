package com.example.petpal.service;

import com.example.petpal.entity.Pet;
import java.util.List;

public interface PetService {

    List<Pet> getAllPets();

    Pet createPet(Pet pet);

    Pet updatePet(Long id, Pet pet);

    void deletePet(Long id);

    Pet getPetById(Long id);
}
