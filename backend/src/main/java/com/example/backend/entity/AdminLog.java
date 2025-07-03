package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_logs")
public class AdminLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "details")
    private String details;

    @Column(name = "ip_address")
    @JsonProperty("ipAddress")
    private String ipAddress;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Constructors
    public AdminLog() {
        this.createdAt = LocalDateTime.now();
    }

    public AdminLog(Long adminId, String action, String details, String ipAddress) {
        this.adminId = adminId;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}