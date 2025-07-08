package com.example.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Tìm orders theo email, sắp xếp theo ngày đặt mới nhất
    List<Order> findByEmailOrderByOrderDateDesc(String email);

    // Tìm order theo orderNumber
    Optional<Order> findByOrderNumber(String orderNumber);

    // Dashboard statistics methods
    List<Order> findByPaymentStatus(String paymentStatus);

    long countByStatus(String status);

    long countByPaymentStatus(String paymentStatus);
}