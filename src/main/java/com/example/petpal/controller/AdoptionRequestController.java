package com.example.petpal.controller;

import com.example.petpal.entity.AdoptionRequest;
import com.example.petpal.service.AdoptionRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adoptions")
public class AdoptionRequestController {

    private final AdoptionRequestService service;

    public AdoptionRequestController(AdoptionRequestService service) {
        this.service = service;
    }

    @PostMapping
    public AdoptionRequest create(@RequestBody AdoptionRequest request) {
        return service.createRequest(request);
    }

    @GetMapping("/pet/{petId}")
    public List<AdoptionRequest> getByPet(@PathVariable String petId) {
        return service.getRequestsForPet(petId);
    }

    @PatchMapping("/{id}/status")
    public void updateStatus(@PathVariable String id, @RequestParam String status) {
        service.updateStatus(id, status);
    }
}
