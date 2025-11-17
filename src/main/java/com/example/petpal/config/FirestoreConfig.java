package com.example.petpal.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.io.FileInputStream;

@Configuration
@Profile("!test")   // Firebase disabled in test profile
public class FirestoreConfig {

    @Value("${firebase.config.path}")
    private String firebaseConfigPath;

    @Bean
    public Firestore firestore() throws Exception {

        // Prevent "FirebaseApp name DEFAULT already exists"
        if (FirebaseApp.getApps().isEmpty()) {
            FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath);

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
        }

        return FirestoreClient.getFirestore();
    }
}
