package com.example.petpal.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdoptionRequest {

    private String id;
    private String petId;
    private String adopterId;
    private String status = "PENDING";
    private String message;

    public AdoptionRequest() {}
}
