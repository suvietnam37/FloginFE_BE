package com.sgu.flogin.service;

import com.sgu.flogin.dto.LoginRequest;
import com.sgu.flogin.dto.LoginResponse;
import com.sgu.flogin.entity.User;
import com.sgu.flogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    // Sử dụng constructor injection, đây là best practice
    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Authenticates a user based on the provided credentials.
     *
     * @param request The login request containing username and password.
     * @return A LoginResponse indicating success or failure.
     */
    public LoginResponse authenticate(LoginRequest request) {
        // Tìm kiếm người dùng theo username trong database
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        // Nếu không tìm thấy người dùng, trả về lỗi
        if (userOptional.isEmpty()) {
            return new LoginResponse(false, "Sai tên đăng nhập hoặc mật khẩu", null);
        }

        User user = userOptional.get();

        // So sánh mật khẩu (lưu ý: trong thực tế, bạn PHẢI dùng password encoder như BCrypt)
        // if (passwordEncoder.matches(request.getPassword(), user.getPassword())) { ... }
        if (user.getPassword().equals(request.getPassword())) {
            // Đăng nhập thành công
            // TODO: Tạo một JWT token thật sự ở đây
            String token = "fake-jwt-token-for-" + user.getUsername();
            return new LoginResponse(true, "Đăng nhập thành công", token);
        } else {
            // Sai mật khẩu
            return new LoginResponse(false, "Sai tên đăng nhập hoặc mật khẩu", null);
        }
    }
}