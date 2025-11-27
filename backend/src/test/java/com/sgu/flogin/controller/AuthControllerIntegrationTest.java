package com.sgu.flogin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgu.flogin.config.SecurityConfig;
import com.sgu.flogin.config.WebConfig;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.containsString;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, WebConfig.class})
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void whenLoginSuccess_thenReturns200OK() throws Exception {
        // ARRANGE
        LoginRequest request = new LoginRequest("testuser", "password");

        // Tạo UserDto với ID kiểu Long (ví dụ: 1L)
        UserDto mockUserDto = new UserDto(1L, "testuser");
        
        // Sử dụng constructor 4 tham số mới của LoginResponse
        LoginResponse mockResponse = new LoginResponse(true, "Đăng nhập thành công", "mock-token", mockUserDto);

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        // ACT & ASSERT
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").value("mock-token"))
                // Kiểm tra cả thông tin user trả về
                .andExpect(jsonPath("$.user.username").value("testuser"));
    }

    @Test
    void whenLoginFailed_thenReturns401Unauthorized() throws Exception {
        // ARRANGE
        LoginRequest request = new LoginRequest("wronguser", "wrongpass");
        
        // Sử dụng constructor 4 tham số, user là null khi thất bại
        LoginResponse mockResponse = new LoginResponse(false, "Sai thông tin", null, null);

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        // ACT & ASSERT
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void whenPreflightRequest_thenReturnsCorsHeaders() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", containsString("POST")));
    }
}
