package com.example.petpal.service;

import com.example.petpal.entity.AdoptionRequest;
import java.util.List;

public interface AdoptionRequestService {

    AdoptionRequest createRequest(AdoptionRequest request);

    List<AdoptionRequest> getRequestsForPet(String petId);

    void updateStatus(String requestId, String status);
}
