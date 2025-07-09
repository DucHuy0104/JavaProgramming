package com.example.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(HttpMethod.POST, "/api/feedback").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/feedback").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/feedback/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/feedback/**").permitAll()
                // Public endpoints
                .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                .requestMatchers("/users/register", "/users/login").permitAll()
                .requestMatchers("/blogs", "/blogs/**").permitAll()
                .requestMatchers("/api/services", "/api/services/**").permitAll()
                .requestMatchers("/test", "/test/**").permitAll()

                // Emergency endpoints (ONLY for development)
                .requestMatchers("/users/make-admin", "/users/make-admin/**", "/users/create-sample-data").permitAll()

                // Allow OPTIONS requests for CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // User profile endpoints - MUST BE BEFORE /api/users/** rule
                .requestMatchers(HttpMethod.GET, "/api/users/profile").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/profile").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/change-password").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/users/add-phone").authenticated()
                .requestMatchers("/api/users/test-auth", "/api/users/debug-db").authenticated()

                // Test admin endpoints
                .requestMatchers("/api/users/test-admin", "/api/users/test-create").hasRole("ADMIN")

                // Admin-only endpoints - TEMPORARILY ALLOW ALL FOR DEBUG
                .requestMatchers("/api/users/admin/**").permitAll()
                .requestMatchers("/api/users/{id}/status").hasRole("ADMIN")

                // Admin and Manager endpoints (MUST BE AFTER specific /api/users/profile rules)
                .requestMatchers("/api/users", "/api/users/**").hasAnyRole("ADMIN", "MANAGER")

                // Orders endpoints
                .requestMatchers(HttpMethod.GET, "/api/orders").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.GET, "/api/orders/user").hasRole("CUSTOMER") // Customer xem orders của mình
                .requestMatchers(HttpMethod.GET, "/api/orders/number/**").permitAll() // Public access for test result lookup
                .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/api/orders/**").hasAnyRole("ADMIN", "MANAGER", "STAFF", "CUSTOMER") // Customer có thể hủy đơn
                .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasRole("ADMIN") // Only admin can delete orders

                // File upload/download endpoints
                .requestMatchers(HttpMethod.POST, "/api/files/upload-result/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.GET, "/api/files/download-result/**").permitAll() // Allow public download
                .requestMatchers(HttpMethod.DELETE, "/api/files/delete-result/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")

                // Blog image endpoints
                .requestMatchers(HttpMethod.GET, "/api/files/blog-images/**").permitAll() // Allow public access to blog images

                // Dashboard endpoints
                .requestMatchers("/api/dashboard/**").hasAnyRole("ADMIN", "MANAGER")

                // Contact endpoint
                .requestMatchers("/api/contact").permitAll()

                // All other requests need authentication
                .anyRequest().authenticated()
            )
            // Add JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow specific origins
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        // Debug CORS
        System.out.println("CORS Configuration loaded:");
        System.out.println("Allowed Origins: " + configuration.getAllowedOrigins());
        System.out.println("Allowed Methods: " + configuration.getAllowedMethods());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
