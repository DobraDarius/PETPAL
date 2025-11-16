package com.example.petpal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Cat, Dog, Bird, etc.
    private String type;

    private String breed;

    private Integer age;

    @Column(length = 1000)
    private String description;

    // URL from Firebase Storage
    private String imageUrl;

    // AVAILABLE, PENDING, ADOPTED
    private String adoptionStatus = "AVAILABLE";

    // Foreign key -> User (owner/shelter)
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PetImage> images = new ArrayList<>();

    public Pet() {}

    public Pet(String name, String type, String breed, Integer age, String description) {
        this.name = name;
        this.type = type;
        this.breed = breed;
        this.age = age;
        this.description = description;
    }
}
