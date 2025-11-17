package com.example.petpal.controller;

import com.example.petpal.entity.Pet;
import com.example.petpal.service.PetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    private final PetService service;

    public PetController(PetService service) {
        this.service = service;
    }

    @PostMapping
    public Pet addPet(@RequestBody Pet pet) {
        return service.addPet(pet);
    }

    @GetMapping("/{id}")
    public Pet getPet(@PathVariable String id) {
        return service.getPetById(id);
    }

    @GetMapping
    public List<Pet> getAllPets() {
        return service.getAllPets();
    }

    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable String id, @RequestBody Pet pet) {
        return service.updatePet(id, pet);
    }

    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable String id) {
        service.deletePet(id);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Pet> getPetsByOwner(@PathVariable String ownerId) {
        return service.getPetsByOwner(ownerId);
    }
}
