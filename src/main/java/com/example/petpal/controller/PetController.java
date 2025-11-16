package com.example.petpal.controller;

import com.example.petpal.entity.Pet;
import com.example.petpal.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    @Autowired
    private PetService petService;

    // CREATE
    @PostMapping
    public ResponseEntity<Pet> addPet(@RequestBody Pet pet) {
        return ResponseEntity.ok(petService.addPet(pet));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        return ResponseEntity.ok(petService.updatePet(id, pet));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok("Pet deleted");
    }

    // GET ALL
    @GetMapping
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    // GET ONE
    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    // SEARCH
    @GetMapping("/search")
    public List<Pet> searchPets(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String location
    ) {
        return petService.searchPets(type, breed, minAge, maxAge, location);
    }

    // ADD IMAGES
    @PostMapping("/{id}/images")
    public ResponseEntity<String> addImages(
            @PathVariable Long id,
            @RequestBody List<String> urls
    ) {
        petService.addImagesToPet(id, urls);
        return ResponseEntity.ok("Images added");
    }

    // DELETE IMAGE
    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long imageId) {
        petService.deleteImage(imageId);
        return ResponseEntity.ok("Image removed");
    }

    // GET PETS BY OWNER
    @GetMapping("/owner/{ownerId}")
    public List<Pet> getPetsByOwner(@PathVariable Long ownerId) {
        return petService.getPetsByOwner(ownerId);
    }
}
