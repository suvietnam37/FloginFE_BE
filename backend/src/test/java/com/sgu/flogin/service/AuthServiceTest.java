// Trong file: /src/test/java/com/sgu/flogin/AuthServiceTest.java
package com.sgu.flogin.service;
import com.sgu.flogin.dto.LoginRequest;
import com.sgu.flogin.dto.LoginResponse;
import com.sgu.flogin.entity.User;
import com.sgu.flogin.repository.UserRepository;
import com.sgu.flogin.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) // Kích hoạt Mockito
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    // --- Test case cho trường hợp đăng nhập thành công ---
    @Test
    void whenValidCredentials_thenShouldLoginSuccessfully() {
        // --- ARRANGE ---
        LoginRequest request = new LoginRequest("testuser", "Test123");
        User userInDb = new User();
        userInDb.setUsername("testuser");
        // Mật khẩu trong DB bây giờ là một chuỗi đã được mã hóa
        userInDb.setPassword("$2a$10$abcdefghijklmnopqrstuv"); 

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userInDb));
        // Dạy cho mock biết: khi so sánh "Test123" với chuỗi mã hóa, kết quả là true
        when(passwordEncoder.matches("Test123", "$2a$10$abcdefghijklmnopqrstuv")).thenReturn(true);

        // --- ACT ---
        LoginResponse response = authService.authenticate(request);

        // --- ASSERT ---
        assertTrue(response.isSuccess());
    }
    // --- Test case cho trường hợp sai mật khẩu ---
    @Test
    void whenWrongPassword_thenShouldFailLogin() {
        // --- ARRANGE ---
        // 1. Dữ liệu đầu vào
        LoginRequest request = new LoginRequest("testuser", "WrongPassword123");

        // 2. Dữ liệu giả lập trong CSDL (username đúng, password khác)
        User userInDb = new User();
        userInDb.setId(1L);
        userInDb.setUsername("testuser");
        userInDb.setPassword("CorrectPassword123"); // Password đúng trong DB

        // 3. Dạy cho mock biết: khi tìm "testuser", hãy trả về user này
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userInDb));

        // --- ACT ---
        LoginResponse response = authService.authenticate(request);

        // --- ASSERT ---
        assertNotNull(response);
        assertFalse(response.isSuccess()); // Mong đợi đăng nhập thất bại
        assertEquals("Sai tên đăng nhập hoặc mật khẩu", response.getMessage());
    }

    // --- Test case cho trường hợp username không tồn tại ---
    @Test
    void whenUsernameNotFound_thenShouldFailLogin() {
        // --- ARRANGE ---
        // 1. Dữ liệu đầu vào
        LoginRequest request = new LoginRequest("nonexistentuser", "SomePassword123");

        // 2. Dạy cho mock biết: khi tìm "nonexistentuser", hãy trả về Optional.empty()
        when(userRepository.findByUsername("nonexistentuser")).thenReturn(Optional.empty());

        // --- ACT ---
        LoginResponse response = authService.authenticate(request);

        // --- ASSERT ---
        assertNotNull(response);
        assertFalse(response.isSuccess()); // Mong đợi đăng nhập thất bại
        assertEquals("Sai tên đăng nhập hoặc mật khẩu", response.getMessage());
    }
}