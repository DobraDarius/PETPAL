package com.example.petpal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password; // required for auth

    private String address;

    private String phone;

    // ADOPTER or SHELTER
    private String role;

    public User() {}
}
