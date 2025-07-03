package com.example.backend.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, COMPLETED, FAILED

    @Column(name = "description")
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Transaction() {
        this.createdAt = LocalDateTime.now();
    }

    public Transaction(Long userId, Double amount, LocalDateTime transactionDate, String status, String description) {
        this.userId = userId;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.status = status;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}