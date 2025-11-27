// Trong file: config/SecurityConfig.java
// Trong file: config/SecurityConfig.java
package com.sgu.flogin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowCredentials(true);
    configuration.addAllowedOriginPattern("*"); // dùng pattern thay vì origin cố định
    configuration.addAllowedMethod("*"); // Cho phép tất cả method
    configuration.addAllowedHeader("*"); // Cho phép tất cả header

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF cho API
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Sử dụng cấu hình CORS đã tạo ở WebConfig
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Cho phép tất cả request đến /api/auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // cho phép preflight
                .anyRequest().authenticated() // Tất cả các request khác phải được xác thực
            )
<<<<<<< Updated upstream
            .httpBasic(httpBasic -> httpBasic.disable()) // Tắt Basic Auth (không cần thiết)
            .formLogin(form -> form.disable()); // Tắt form login của Spring
=======
            .exceptionHandling(ex -> ex
            .authenticationEntryPoint((req, res, authEx) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
            );
>>>>>>> Stashed changes
        return http.build();
    }
    
}