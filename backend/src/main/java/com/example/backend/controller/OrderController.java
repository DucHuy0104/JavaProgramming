package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

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
        System.out.println("=== UPDATE ORDER STATUS ===");
        System.out.println("Order ID: " + id);
        System.out.println("New Status: " + update.getStatus());
        Order result = orderService.updateOrderStatus(id, update.getStatus());
        System.out.println("Update result: " + (result != null ? "Success" : "Failed"));
        return result;
    }

    @PatchMapping("/{id}/payment")
    public Order updatePaymentStatus(@PathVariable Long id, @RequestBody Order update) {
        return orderService.updatePaymentStatus(id, update.getPaymentStatus());
    }

    // API để lấy orders của user hiện tại
    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Order> userOrders = orderService.getOrdersByUserEmail(email);
            return ResponseEntity.ok(userOrders);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}