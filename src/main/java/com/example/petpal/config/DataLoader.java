package com.example.petpal.config;

import com.example.petpal.entity.User;
import com.example.petpal.entity.Pet;
import com.example.petpal.repository.UserRepository;
import com.example.petpal.repository.PetRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(UserRepository userRepository, PetRepository petRepository) {
        return args -> {
            ObjectMapper mapper = new ObjectMapper();

            try {
                InputStream userStream = TypeReference.class.getResourceAsStream("/users.json");
                if (userStream == null) {
                    System.out.println("users.json not found!");
                } else {
                    List<User> users = mapper.readValue(userStream, new TypeReference<>() {});
                    if (userRepository.count() == 0) {
                        userRepository.saveAll(users);
                        System.out.println("Loaded " + users.size() + " users.");
                    } else {
                        System.out.println("ℹ Users not loaded (table not empty).");
                    }
                }
            } catch (Exception e) {
                System.out.println("Failed to load users.json: " + e.getMessage());
            }

            // -------------------------------
            // 2️⃣ THEN LOAD PETS
            // -------------------------------
            try {
                InputStream petStream = TypeReference.class.getResourceAsStream("/pets.json");
                if (petStream == null) {
                    System.out.println("pets.json not found!");
                } else {
                    List<Pet> pets = mapper.readValue(petStream, new TypeReference<>() {});
                    if (petRepository.count() == 0) {
                        petRepository.saveAll(pets);
                        System.out.println("Loaded " + pets.size() + " pets.");
                    } else {
                        System.out.println("Pets not loaded (table not empty).");
                    }
                }
            } catch (Exception e) {
                System.out.println("Failed to load pets.json: " + e.getMessage());
            }
        };
    }
}
