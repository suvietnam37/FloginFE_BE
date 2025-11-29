package com.sgu.flogin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

/**
 * Lớp cấu hình cho Spring Security.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Cung cấp một Bean PasswordEncoder để mã hóa mật khẩu. Chúng ta sử dụng
     * BCrypt, một thuật toán băm mạnh và tiêu chuẩn ngành.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Cấu hình chuỗi bộ lọc bảo mật (Security Filter Chain). Đây là nơi định
     * nghĩa các quy tắc truy cập cho các request HTTP.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. TẮT CSRF: Rất quan trọng cho các API stateless (RESTful APIs)
                // Cơ chế bảo vệ CSRF dựa trên session cookie, không phù hợp với JWT/Token-based auth.
                .csrf(csrf -> csrf.disable())
                // 2. CẤU HÌNH QUYỀN TRUY CẬP (AUTHORIZATION)
                .authorizeHttpRequests(auth -> auth
                // Cho phép tất cả các request mà không cần xác thực.
                // LƯU Ý: Cấu hình này rất tiện lợi cho việc phát triển và chạy E2E test,
                // nhưng KHÔNG AN TOÀN cho môi trường production.
                // Trong thực tế, bạn sẽ cấu hình chi tiết hơn (ví dụ: .requestMatchers("/api/products/**").hasRole("ADMIN"))
                .anyRequest().permitAll()
                )
                // 3. SỬ DỤNG CẤU HÌNH CORS ĐÃ ĐỊNH NGHĨA Ở WebConfig
                // withDefaults() sẽ tự động tìm bean CorsConfigurationSource
                .cors(withDefaults());

        return http.build();
    }
}
