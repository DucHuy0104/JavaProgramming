package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PatchMapping("/{id}")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody Order update) {
        return orderService.updateOrderStatus(id, update.getStatus());
    }

    @PatchMapping("/{id}/payment")
    public Order updatePaymentStatus(@PathVariable Long id, @RequestBody Order update) {
        return orderService.updatePaymentStatus(id, update.getPaymentStatus());
    }
} 