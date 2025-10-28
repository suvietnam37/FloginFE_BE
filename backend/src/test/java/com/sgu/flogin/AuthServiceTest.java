// Trong file: /src/test/java/com/sgu/flogin/AuthServiceTest.java
package com.sgu.flogin;

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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) // Kích hoạt Mockito
class AuthServiceTest {

    @Mock // 1. Tạo một đối tượng giả (mock) của UserRepository
    private UserRepository userRepository;

    @InjectMocks // 2. Tạo một instance của AuthService và tự động inject mock ở trên vào
    private AuthService authService;

    // --- Test case cho trường hợp đăng nhập thành công ---
    @Test
    void whenValidCredentials_thenShouldLoginSuccessfully() {
        // --- ARRANGE (Chuẩn bị dữ liệu) ---
        // 1. Dữ liệu đầu vào từ người dùng
        LoginRequest request = new LoginRequest("testuser", "Test123");

        // 2. Dữ liệu giả lập trong CSDL
        User userInDb = new User();
        userInDb.setId(1L);
        userInDb.setUsername("testuser");
        userInDb.setPassword("Test123"); // Trong thực tế mật khẩu sẽ được mã hóa

        // 3. Dạy cho mock biết phải làm gì:
        // "Khi phương thức findByUsername được gọi với 'testuser',
        // hãy trả về một đối tượng User đã được bọc trong Optional"
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userInDb));

        // --- ACT (Thực thi phương thức cần test) ---
        LoginResponse response = authService.authenticate(request);

        // --- ASSERT (Kiểm tra kết quả) ---
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Đăng nhập thành công", response.getMessage());
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