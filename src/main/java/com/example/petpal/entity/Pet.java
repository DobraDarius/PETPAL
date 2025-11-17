package com.example.petpal.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Pet {

    private String id;        // Firestore document ID
    private String name;
    private String type;
    private String breed;
    private Integer age;
    private String description;
    private String imageUrl;
    private String adoptionStatus;  // AVAILABLE/PENDING/ADOPTED
    private String ownerId;         // Reference by ID
    private List<String> images;    // URLs only

    public Pet() {}
}
