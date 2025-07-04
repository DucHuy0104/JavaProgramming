package com.example.backend.repository;

import com.example.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Tìm orders theo email, sắp xếp theo ngày đặt mới nhất
    List<Order> findByEmailOrderByOrderDateDesc(String email);
}