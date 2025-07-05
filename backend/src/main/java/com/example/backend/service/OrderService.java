package com.example.backend.service;

import com.example.backend.entity.Order;
import com.example.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    // Workflow Status Constants
    public static final class Status {
        // Common statuses
        public static final String PENDING_REGISTRATION = "pending_registration";
        public static final String ACCEPTED = "accepted";
        public static final String CANCELLED = "cancelled";
        public static final String RESULTS_DELIVERED = "results_delivered";
        
        // Self submission workflow (DNA dân sự)
        public static final String KIT_SENT = "kit_sent";
        public static final String SAMPLE_COLLECTED_SELF = "sample_collected_self";
        public static final String SAMPLE_IN_TRANSIT = "sample_in_transit";
        public static final String SAMPLE_RECEIVED_LAB = "sample_received_lab";
        public static final String TESTING_IN_PROGRESS = "testing_in_progress";
        public static final String RESULTS_RECORDED = "results_recorded";
        
        // In-clinic workflow
        public static final String SAMPLE_COLLECTED_CLINIC = "sample_collected_clinic";
        
        // Home collection workflow
        public static final String STAFF_DISPATCHED = "staff_dispatched";
        public static final String SAMPLE_COLLECTED_HOME = "sample_collected_home";
    }

    public Order createOrder(Order order) {
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            order.setOrderNumber("ORD" + System.currentTimeMillis());
        }
        
        // Set initial status based on order type
        if (order.getStatus() == null) {
            order.setStatus(Status.PENDING_REGISTRATION);
        }
        
        // Set order date if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
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
            
            // Update status and related timestamps
            order.setStatus(status);
            updateStatusTimestamps(order, status);
            
            Order saved = orderRepository.save(order);
            System.out.println("Order saved successfully");
            return saved;
        }
        System.out.println("Order not found!");
        return null;
    }
    
    private void updateStatusTimestamps(Order order, String status) {
        LocalDateTime now = LocalDateTime.now();
        
        switch (status) {
            case Status.ACCEPTED:
                order.setAcceptedDate(now);
                break;
            case Status.KIT_SENT:
                order.setKitSentDate(now);
                break;
            case Status.SAMPLE_COLLECTED_SELF:
            case Status.SAMPLE_COLLECTED_CLINIC:
            case Status.SAMPLE_COLLECTED_HOME:
                order.setSampleCollectedDate(now);
                break;
            case Status.SAMPLE_RECEIVED_LAB:
                order.setSampleReceivedDate(now);
                break;
            case Status.TESTING_IN_PROGRESS:
                order.setTestingStartedDate(now);
                break;
            case Status.RESULTS_RECORDED:
                order.setResultsReadyDate(now);
                break;
            case Status.RESULTS_DELIVERED:
                order.setResultsDeliveredDate(now);
                break;
        }
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
    
    // Get next possible statuses for an order
    public List<String> getNextPossibleStatuses(String currentStatus, String orderType) {
        if (Status.CANCELLED.equals(currentStatus) || Status.RESULTS_DELIVERED.equals(currentStatus)) {
            return List.of(); // No next statuses for completed orders
        }
        
        if (Status.PENDING_REGISTRATION.equals(currentStatus)) {
            if ("self_submission".equals(orderType)) {
                return List.of(Status.ACCEPTED, Status.KIT_SENT, Status.CANCELLED);
            } else if ("in_clinic".equals(orderType)) {
                return List.of(Status.ACCEPTED, Status.SAMPLE_COLLECTED_CLINIC, Status.CANCELLED);
            } else if ("home_collection".equals(orderType)) {
                return List.of(Status.ACCEPTED, Status.STAFF_DISPATCHED, Status.CANCELLED);
            }
        }
        
        if (Status.ACCEPTED.equals(currentStatus)) {
            if ("self_submission".equals(orderType)) {
                return List.of(Status.KIT_SENT, Status.CANCELLED);
            } else if ("in_clinic".equals(orderType)) {
                return List.of(Status.SAMPLE_COLLECTED_CLINIC, Status.CANCELLED);
            } else if ("home_collection".equals(orderType)) {
                return List.of(Status.STAFF_DISPATCHED, Status.CANCELLED);
            }
        }
        
        // Self submission workflow
        if ("self_submission".equals(orderType)) {
            switch (currentStatus) {
                case Status.KIT_SENT:
                    return List.of(Status.SAMPLE_COLLECTED_SELF, Status.CANCELLED);
                case Status.SAMPLE_COLLECTED_SELF:
                    return List.of(Status.SAMPLE_IN_TRANSIT, Status.CANCELLED);
                case Status.SAMPLE_IN_TRANSIT:
                    return List.of(Status.SAMPLE_RECEIVED_LAB, Status.CANCELLED);
                case Status.SAMPLE_RECEIVED_LAB:
                    return List.of(Status.TESTING_IN_PROGRESS, Status.CANCELLED);
                case Status.TESTING_IN_PROGRESS:
                    return List.of(Status.RESULTS_RECORDED, Status.CANCELLED);
                case Status.RESULTS_RECORDED:
                    return List.of(Status.RESULTS_DELIVERED, Status.CANCELLED);
            }
        }
        
        // In-clinic workflow
        if ("in_clinic".equals(orderType)) {
            switch (currentStatus) {
                case Status.SAMPLE_COLLECTED_CLINIC:
                    return List.of(Status.TESTING_IN_PROGRESS, Status.CANCELLED);
                case Status.TESTING_IN_PROGRESS:
                    return List.of(Status.RESULTS_RECORDED, Status.CANCELLED);
                case Status.RESULTS_RECORDED:
                    return List.of(Status.RESULTS_DELIVERED, Status.CANCELLED);
            }
        }
        
        // Home collection workflow
        if ("home_collection".equals(orderType)) {
            switch (currentStatus) {
                case Status.STAFF_DISPATCHED:
                    return List.of(Status.SAMPLE_COLLECTED_HOME, Status.CANCELLED);
                case Status.SAMPLE_COLLECTED_HOME:
                    return List.of(Status.SAMPLE_RECEIVED_LAB, Status.CANCELLED);
                case Status.SAMPLE_RECEIVED_LAB:
                    return List.of(Status.TESTING_IN_PROGRESS, Status.CANCELLED);
                case Status.TESTING_IN_PROGRESS:
                    return List.of(Status.RESULTS_RECORDED, Status.CANCELLED);
                case Status.RESULTS_RECORDED:
                    return List.of(Status.RESULTS_DELIVERED, Status.CANCELLED);
            }
        }
        
        return List.of();
    }
}