package com.example.petpal.service.impl;

import com.example.petpal.entity.AdoptionRequest;
import com.example.petpal.repository.AdoptionRequestRepository;
import com.example.petpal.service.AdoptionRequestService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdoptionRequestServiceImpl implements AdoptionRequestService {

    private final AdoptionRequestRepository repository;

    public AdoptionRequestServiceImpl(AdoptionRequestRepository repository) {
        this.repository = repository;
    }

    @Override
    public AdoptionRequest submitRequest(AdoptionRequest request) {
        return repository.save(request);
    }

    @Override
    public List<AdoptionRequest> getRequestsForPet(Long petId) {
        return repository.findAll().stream()
                .filter(req -> req.getPet().getId().equals(petId))
                .toList();
    }

    @Override
    public AdoptionRequest approveRequest(Long requestId) {
        AdoptionRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("APPROVED");
        return repository.save(request);
    }

    @Override
    public AdoptionRequest rejectRequest(Long requestId) {
        AdoptionRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("REJECTED");
        return repository.save(request);
    }
}
