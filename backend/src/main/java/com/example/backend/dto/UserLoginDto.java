package com.example.backend.dto;

public class UserLoginDto {
    private String emailOrPhone;
    private String password;

    // Constructors
    public UserLoginDto() {}

    public UserLoginDto(String emailOrPhone, String password) {
        this.emailOrPhone = emailOrPhone;
        this.password = password;
    }

    // Getters and Setters
    public String getEmailOrPhone() {
        return emailOrPhone;
    }

    public void setEmailOrPhone(String emailOrPhone) {
        this.emailOrPhone = emailOrPhone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
