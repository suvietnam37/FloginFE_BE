package com.sgu.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.flogin.config.TestSecurityConfig;
import com.sgu.flogin.dto.LoginRequest;
import com.sgu.flogin.dto.LoginResponse;
import com.sgu.flogin.dto.UserDto;
import com.sgu.flogin.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@WebMvcTest(AuthController.class) // Chỉ test Controller này, không load toàn bộ ứng dụng
@Import(TestSecurityConfig.class)
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc; // Dùng để thực hiện các request HTTP giả

    @Autowired
    private ObjectMapper objectMapper; // Dùng để chuyển đổi object Java sang JSON

    @MockBean // Tạo một mock của AuthService và đưa vào Spring Context
    private AuthService authService;

    @Test
    void whenLoginSuccess_thenReturns200OK() throws Exception {
        // --- ARRANGE ---
        LoginRequest request = new LoginRequest("testuser", "password");
        UserDto mockUserDto = new UserDto(1L, "testuser");
        LoginResponse mockResponse = new LoginResponse(true, "Đăng nhập thành công", "mock-token", mockUserDto);
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        // --- ACT ---
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        // --- ASSERT ---
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
                .andExpect(jsonPath("$.token").value("mock-token"));

        // --- VERIFY (cũng là một phần của Assert) ---
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    @Test
    void whenLoginFailed_thenReturns401Unauthorized() throws Exception {
        // --- ARRANGE ---
        LoginRequest request = new LoginRequest("wronguser", "wrongpass");
        LoginResponse mockResponse = new LoginResponse(false, "Sai thông tin", null, null);
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        // --- ACT & ASSERT ---
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        // --- VERIFY ---s
        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
}