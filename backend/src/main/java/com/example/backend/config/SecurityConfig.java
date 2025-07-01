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
                // Public endpoints
                .requestMatchers("/users/register", "/users/login").permitAll()
                .requestMatchers("/blogs", "/blogs/**").permitAll()
                .requestMatchers("/test", "/test/**").permitAll()

                // Emergency endpoints (ONLY for development)
                .requestMatchers("/users/make-admin", "/users/make-admin/**", "/users/create-sample-data").permitAll()

                // Allow OPTIONS requests for CORS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // User profile endpoints - MUST BE BEFORE /users/** rule
                .requestMatchers(HttpMethod.GET, "/users/profile").authenticated()
                .requestMatchers(HttpMethod.PUT, "/users/profile").authenticated()
                .requestMatchers(HttpMethod.POST, "/users/change-password").authenticated()
                .requestMatchers(HttpMethod.POST, "/users/add-phone").authenticated()
                .requestMatchers("/users/test-auth", "/users/debug-db").authenticated()

                // Test admin endpoints
                .requestMatchers("/users/test-admin", "/users/test-create").hasRole("ADMIN")

                // Admin-only endpoints - TEMPORARILY ALLOW ALL FOR DEBUG
                .requestMatchers("/users/admin/**").permitAll()
                .requestMatchers("/users/{id}/status").hasRole("ADMIN")

                // Admin and Manager endpoints (MUST BE AFTER specific /users/profile rules)
                .requestMatchers("/users", "/users/**").hasAnyRole("ADMIN", "MANAGER")

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
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"));
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
