package com.sgu.flogin;

import com.sgu.flogin.dto.LoginRequest;
import com.sgu.flogin.dto.LoginResponse;
import com.sgu.flogin.entity.User;
import com.sgu.flogin.repository.UserRepository;
import com.sgu.flogin.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("TC1: Should login successfully with valid credentials")
    void whenValidCredentials_thenShouldLoginSuccessfully() {
        // Arrange
        LoginRequest request = new LoginRequest("testuser", "password123");
        User userInDb = new User();
        userInDb.setId(1L);
        userInDb.setUsername("testuser");
        userInDb.setPassword("password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userInDb));

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Đăng nhập thành công", response.getMessage());
        assertNotNull(response.getToken());
    }

    @Test
    @DisplayName("TC2: Should fail login with non-existent username")
    void whenNonExistentUsername_thenShouldFailLogin() {
        // Arrange
        LoginRequest request = new LoginRequest("unknownuser", "password123");

        // Dạy cho mock biết rằng không tìm thấy user này
        when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Sai tên đăng nhập hoặc mật khẩu", response.getMessage());
        assertNull(response.getToken());
    }

    @Test
    @DisplayName("TC3: Should fail login with incorrect password")
    void whenIncorrectPassword_thenShouldFailLogin() {
        // Arrange
        LoginRequest request = new LoginRequest("testuser", "wrongpassword");
        User userInDb = new User();
        userInDb.setId(1L);
        userInDb.setUsername("testuser");
        userInDb.setPassword("correctpassword123"); // Mật khẩu đúng trong DB

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userInDb));

        // Act
        LoginResponse response = authService.authenticate(request);

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Sai tên đăng nhập hoặc mật khẩu", response.getMessage());
        assertNull(response.getToken());
    }
}