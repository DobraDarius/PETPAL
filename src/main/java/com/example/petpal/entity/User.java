package com.example.petpal.entity;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class User {

    private String id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private String role;

    public User() {}
}
