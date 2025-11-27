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

@WebMvcTest(AuthController.class) // Chỉ test Controller này, không load toàn bộ ứng dụng
@Import(TestSecurityConfig.class)
public class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc; // Dùng để thực hiện các request HTTP giả

    @Autowired
    private ObjectMapper objectMapper; // Dùng để chuyển đổi object Java sang JSON

    @MockBean // QUAN TRỌNG: Tạo một mock của AuthService và đưa vào Spring Context
    private AuthService authService;

    @Test
    void whenLoginSuccess_thenReturns200OK() throws Exception {
        // ARRANGE
        LoginRequest request = new LoginRequest("testuser", "password");
        UserDto mockUserDto = new UserDto(1L, "testuser");
        LoginResponse mockResponse = new LoginResponse(true, "Đăng nhập thành công", "mock-token", mockUserDto);

        // Dạy cho mock service: Khi phương thức authenticate được gọi với bất kỳ LoginRequest nào,
        // hãy trả về mockResponse đã chuẩn bị sẵn.
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        // ACT & ASSERT
        mockMvc.perform(post("/api/auth/login") // Thực hiện request POST
                .contentType(MediaType.APPLICATION_JSON) // Set header Content-Type
                .content(objectMapper.writeValueAsString(request))) // Gửi body là JSON
                .andExpect(status().isOk()) // Mong đợi status 200 OK
                .andExpect(jsonPath("$.success").value(true)) // Kiểm tra nội dung JSON trả về
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công"))
                .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    void whenLoginFailed_thenReturns401Unauthorized() throws Exception {
        // ARRANGE
        LoginRequest request = new LoginRequest("wronguser", "wrongpass");
        LoginResponse mockResponse = new LoginResponse(false, "Sai thông tin", null, null);

        // Dạy cho mock service trường hợp thất bại
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(mockResponse);

        // ACT & ASSERT
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()) // Mong đợi status 401 Unauthorized
                .andExpect(jsonPath("$.success").value(false));
    }
}