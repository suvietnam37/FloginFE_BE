package com.sgu.flogin.service;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("TC1: Đăng nhập thành công")
    void whenValidCredentials_thenShouldLoginSuccessfully() {

        LoginRequest request = new LoginRequest("testuser", "Test123");
        User userInDb = new User();
        userInDb.setUsername("testuser");
        userInDb.setPassword("$2a$10$abcdefghijklmnopqrstuv"); 

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userInDb));
        when(passwordEncoder.matches("Test123", "$2a$10$abcdefghijklmnopqrstuv")).thenReturn(true);

        LoginResponse response = authService.authenticate(request);

        assertTrue(response.isSuccess());
    }

    @Test
    @DisplayName("TC2: Đăng nhập với username không tồn tại")
    void whenUsernameNotFound_thenShouldFailLogin() {

        LoginRequest request = new LoginRequest("nonexistentuser", "SomePassword123");

        when(userRepository.findByUsername("nonexistentuser")).thenReturn(Optional.empty());

        LoginResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Sai tên đăng nhập hoặc mật khẩu", response.getMessage());
    }

    @Test
    @DisplayName("TC3: Đăng nhập với mật khẩu sai")
    void whenWrongPassword_thenShouldFailLogin() {

        LoginRequest request = new LoginRequest("testuser", "WrongPassword123");

        User userInDb = new User();
        userInDb.setId(1L);
        userInDb.setUsername("testuser");
        userInDb.setPassword("CorrectPassword123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userInDb));
        when(passwordEncoder.matches("WrongPassword123", "CorrectPassword123")).thenReturn(false);

        LoginResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("Sai tên đăng nhập hoặc mật khẩu", response.getMessage());
    }

    @Test
    @DisplayName("TC4: Validation errors")
    void whenLoginWithEmptyUsername_thenShouldFailLogin() {

        LoginRequest request = new LoginRequest("", "SomePassword123");
    
        when(userRepository.findByUsername("")).thenReturn(Optional.empty());
        LoginResponse response = authService.authenticate(request);
    
        assertFalse(response.isSuccess());
        assertEquals("Sai tên đăng nhập hoặc mật khẩu", response.getMessage());
    }
}