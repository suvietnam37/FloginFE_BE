// Trong file: config/SecurityConfig.java
package com.sgu.flogin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF cho API
            .cors(cors -> {}) // Sử dụng cấu hình CORS đã tạo ở WebConfig
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Cho phép tất cả request đến /api/auth
                .anyRequest().authenticated() // Tất cả các request khác phải được xác thực
            )
            .httpBasic(httpBasic -> httpBasic.disable()) // Tắt Basic Auth (không cần thiết)
            .formLogin(form -> form.disable()); // Tắt form login của Spring
        return http.build();
    }
    
}