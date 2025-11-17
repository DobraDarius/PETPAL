package com.example.petpal;

import com.example.petpal.controller.UserController;
import com.example.petpal.entity.User;
import com.example.petpal.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(UserControllerTest.MockConfig.class)
class UserControllerTest {

    @Autowired
    MockMvc mvc;


    @Autowired
    UserService service;

    // → Define bean replacements manually
    static class MockConfig {
        @Bean
        public UserService userService() {
            return Mockito.mock(UserService.class);
        }
    }

    @BeforeEach
    void setup() {
        // optional setup
    }

    @Test
    void testGetUser() throws Exception {
        var user = new User();
        user.setId("abc123");
        user.setName("John");

        when(service.getUserById("abc123")).thenReturn(user);

        mvc.perform(get("/users/abc123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John"));
    }
}
