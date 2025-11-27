// Trong file: service/AuthService.java
package com.sgu.flogin.service;

import com.sgu.flogin.dto.LoginRequest;
import com.sgu.flogin.dto.LoginResponse;
import com.sgu.flogin.dto.UserDto;
import com.sgu.flogin.entity.User;
import com.sgu.flogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder; 

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse authenticate(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                
                // TẠO UserDto để trả về
                UserDto userDto = new UserDto(user.getId(), user.getUsername());
                
                // Gọi constructor 4 tham số khi đăng nhập thành công
                return new LoginResponse(true, "Đăng nhập thành công", "some-jwt-token", userDto);
            }
        }
        return new LoginResponse(false, "Sai tên đăng nhập hoặc mật khẩu", null, null);
    }
}