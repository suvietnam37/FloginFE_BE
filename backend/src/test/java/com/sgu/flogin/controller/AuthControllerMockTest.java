package com.sgu.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.flogin.dto.LoginRequest;
import com.sgu.flogin.dto.LoginResponse;
import com.sgu.flogin.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import javax.naming.AuthenticationException;

/**
 * File: AuthControllerMockTest.java
 * Mục tiêu: Kiểm thử controller mà không chạy service thật
 */
@WebMvcTest(AuthController.class)
public class AuthControllerMockTest extends RuntimeException{
    public AuthenticationException(String message) {
        super(message);
    }
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName(" TC1: Mocked login thành công")
    void testLoginWithMockedServiceSuccess() throws Exception {
        // Tạo dữ liệu giả
        LoginResponse mockResponse = new LoginResponse(true, "Đăng nhập thành công", "mock-token-123");
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        LoginRequest request = new LoginRequest("testuser", "Test123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("mock-token-123"));

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    @Test
    @DisplayName(" TC2: Mocked login thất bại (Invalid credentials)")
    void testLoginWithMockedServiceFailure() throws Exception {
        when(authService.authenticate(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        LoginRequest request = new LoginRequest("wronguser", "wrongpass");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
}
