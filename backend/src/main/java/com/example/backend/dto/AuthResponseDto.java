package com.example.backend.dto;

import com.example.backend.entity.User;

public class AuthResponseDto {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String status;
    private String redirectUrl;

    // Constructors
    public AuthResponseDto() {}

    public AuthResponseDto(String token, User user) {
        this.token = token;
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.redirectUrl = determineRedirectUrl(user.getRole());
    }

    public AuthResponseDto(String token, User user, String redirectUrl) {
        this.token = token;
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.redirectUrl = redirectUrl;
    }

    private String determineRedirectUrl(String role) {
        switch (role) {
            case "ADMIN":
            case "MANAGER":
            case "STAFF":
                return "/admin";
            case "CUSTOMER":
                return "/home";
            default:
                return "/home";
        }
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
