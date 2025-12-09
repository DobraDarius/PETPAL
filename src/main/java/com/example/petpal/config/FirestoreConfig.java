package com.example.petpal.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
// Import ClassPathResource
import org.springframework.core.io.ClassPathResource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.io.InputStream;

@Configuration
@Profile("!test")
public class FirestoreConfig {

    // We don't strictly need the @Value path anymore if we standardise the filename
    // But we can keep the structure if you prefer.

    @Bean
    public Firestore firestore() throws Exception {

        if (FirebaseApp.getApps().isEmpty()) {
            // UPDATED LOGIC HERE:
            // This looks for "serviceAccountKey.json" directly inside src/main/resources
            ClassPathResource serviceAccountResource = new ClassPathResource("ServiceAccountKey.json");

            // Open the stream
            InputStream serviceAccount = serviceAccountResource.getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
        }

        return FirestoreClient.getFirestore();
    }
}