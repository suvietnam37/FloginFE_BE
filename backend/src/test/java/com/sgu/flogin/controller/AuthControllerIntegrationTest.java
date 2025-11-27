package com.sgu.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.flogin.dto.LoginRequest;
import com.sgu.flogin.dto.LoginResponse;
import com.sgu.flogin.dto.UserDto;
import com.sgu.flogin.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // bỏ filter chain, không load SecurityConfig
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("testuser", "Test123");

        LoginResponse mockResponse = new LoginResponse(
            true, "Đăng nhập thành công", "token123",
            new UserDto("testuser", "testuser@example.com")
        );

        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.token").value("token123"))
            .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
            .andExpect(jsonPath("$.user.username").value("testuser"));
    }

    @Test
    void testLoginFailure() throws Exception {
        LoginRequest request = new LoginRequest("wronguser", "wrongpass");

        LoginResponse mockResponse = new LoginResponse(
            false, "Sai thông tin đăng nhập", null, null
        );

        when(authService.authenticate(any(LoginRequest.class)))
            .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("Sai thông tin đăng nhập"));
    }

}
