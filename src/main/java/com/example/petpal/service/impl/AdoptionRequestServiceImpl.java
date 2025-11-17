package com.example.petpal.service.impl;

import com.example.petpal.entity.AdoptionRequest;
import com.example.petpal.service.AdoptionRequestService;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdoptionRequestServiceImpl implements AdoptionRequestService {

    private final Firestore db;

    public AdoptionRequestServiceImpl(Firestore db) {
        this.db = db;
    }

    private CollectionReference requests() {
        return db.collection("adoption_requests");
    }

    @Override
    public AdoptionRequest createRequest(AdoptionRequest req) {
        String id = requests().document().getId();
        req.setId(id);
        requests().document(id).set(req);
        return req;
    }

    @Override
    public List<AdoptionRequest> getRequestsForPet(String petId) {
        try {
            return requests()
                    .whereEqualTo("petId", petId)
                    .get().get()
                    .getDocuments()
                    .stream()
                    .map(d -> d.toObject(AdoptionRequest.class))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Cannot fetch adoption requests", e);
        }
    }

    @Override
    public void updateStatus(String reqId, String status) {
        requests().document(reqId).update("status", status);
    }
}
