package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    @JsonProperty("phoneNumber")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Profile() {
        this.updatedAt = LocalDateTime.now();
    }

    public Profile(Long userId, String fullName, String address, String phoneNumber, String dateOfBirth) {
        this.userId = userId;
        this.fullName = fullName;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}