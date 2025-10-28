// Trong file: service/AuthService.java
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

    @Autowired
    private UserRepository userRepository;

    public LoginResponse authenticate(LoginRequest request) {
        // 1. Tìm user trong CSDL bằng username
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        // 2. Kiểm tra xem user có tồn tại và mật khẩu có khớp không
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(request.getPassword())) {
                // Nếu khớp, trả về response thành công
                return new LoginResponse(true, "Đăng nhập thành công", "some-jwt-token");
            }
        }

        // 3. Nếu không, trả về response thất bại (sẽ viết test cho trường hợp này sau)
        return new LoginResponse(false, "Sai tên đăng nhập hoặc mật khẩu", null);
    }
}