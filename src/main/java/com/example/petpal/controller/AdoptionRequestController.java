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
    public AdoptionRequest submitRequest(@RequestBody AdoptionRequest request) {
        return service.submitRequest(request);
    }

    @GetMapping("/pet/{petId}")
    public List<AdoptionRequest> getRequestsForPet(@PathVariable Long petId) {
        return service.getRequestsForPet(petId);
    }

    @PutMapping("/{id}/approve")
    public AdoptionRequest approve(@PathVariable Long id) {
        return service.approveRequest(id);
    }

    @PutMapping("/{id}/reject")
    public AdoptionRequest reject(@PathVariable Long id) {
        return service.rejectRequest(id);
    }
}
