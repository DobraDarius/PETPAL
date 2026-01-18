package com.example.petpal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@SpringBootApplication
public class PetpalApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetpalApplication.class, args);
	}

	/**
	 * LOCAL MODE CONFIGURATION
	 * Simple, standard CORS setup that trusts your local React app.
	 */
	@Bean
	public CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();

		// 1. Allow Cookies/Credentials
		config.setAllowCredentials(true);

		// 2. Allow ONLY localhost:3000 (Safe and simple)
		config.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));

		// 3. Allow standard headers and methods
		config.setAllowedHeaders(Collections.singletonList("*"));
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

		source.registerCorsConfiguration("/**", config);
		return new CorsFilter(source);
	}
}