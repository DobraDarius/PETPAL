package com.example.petpal.service;

import com.example.petpal.entity.AdoptionRequest;

import java.util.List;

public interface AdoptionRequestService {
    AdoptionRequest submitRequest(AdoptionRequest request);
    List<AdoptionRequest> getRequestsForPet(Long petId);
    AdoptionRequest approveRequest(Long requestId);
    AdoptionRequest rejectRequest(Long requestId);
}
