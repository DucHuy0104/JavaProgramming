package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            order.setOrderNumber("ORD" + System.currentTimeMillis());
        }
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order updateOrderStatus(Long id, String status) {
        System.out.println("=== ORDER SERVICE UPDATE ===");
        System.out.println("Looking for order ID: " + id);
        Optional<Order> orderOpt = orderRepository.findById(id);
        System.out.println("Order found: " + orderOpt.isPresent());
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            System.out.println("Current status: " + order.getStatus());
            System.out.println("New status: " + status);
            order.setStatus(status);
            Order saved = orderRepository.save(order);
            System.out.println("Order saved successfully");
            return saved;
        }
        System.out.println("Order not found!");
        return null;
    }

    public Order updatePaymentStatus(Long id, String paymentStatus) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setPaymentStatus(paymentStatus);
            return orderRepository.save(order);
        }
        return null;
    }

    // Lấy orders theo email của user
    public List<Order> getOrdersByUserEmail(String email) {
        return orderRepository.findByEmailOrderByOrderDateDesc(email);
    }
}