package com.example.petpal.repository;

import com.example.petpal.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query("SELECT p FROM Pet p WHERE " +
            "(:type IS NULL OR p.type = :type) AND " +
            "(:breed IS NULL OR p.breed = :breed) AND " +
            "(:minAge IS NULL OR p.age >= :minAge) AND " +
            "(:maxAge IS NULL OR p.age <= :maxAge)")
    List<Pet> searchPets(String type,
                         String breed,
                         Integer minAge,
                         Integer maxAge);

    List<Pet> findByOwnerId(Long ownerId);
}
