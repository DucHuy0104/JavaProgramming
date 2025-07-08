package com.example.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.service.OrderService;
import com.example.backend.service.ServiceService;
import com.example.backend.service.UserService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private ServiceService serviceService;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> getDashboardStats() {
        try {
            System.out.println("=== DASHBOARD STATS REQUEST ===");

            // Lấy thống kê cơ bản
            long totalOrders = orderService.countTotalOrders();
            long totalCustomers = userService.countCustomers();
            long totalServices = serviceService.countActiveServices();
            double totalRevenue = orderService.calculateTotalRevenue();

            System.out.println("Total Orders: " + totalOrders);
            System.out.println("Total Customers: " + totalCustomers);
            System.out.println("Total Services: " + totalServices);
            System.out.println("Total Revenue: " + totalRevenue);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalOrders", totalOrders);
            stats.put("totalCustomers", totalCustomers);
            stats.put("totalServices", totalServices);
            stats.put("totalRevenue", totalRevenue);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error getting dashboard stats: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy thống kê dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/orders-chart")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> getOrdersChart() {
        try {
            System.out.println("=== ORDERS CHART REQUEST ===");

            Map<String, Object> chartData = orderService.getOrdersChartData();
            System.out.println("Orders chart data: " + chartData);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", chartData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error getting orders chart: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy thống kê đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/revenue-chart")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> getRevenueChart() {
        try {
            System.out.println("=== REVENUE CHART REQUEST ===");

            Map<String, Object> chartData = orderService.getRevenueChartData();
            System.out.println("Revenue chart data: " + chartData);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", chartData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error getting revenue chart: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy thống kê doanh thu: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/customers-chart")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> getCustomersChart() {
        try {
            System.out.println("=== CUSTOMERS CHART REQUEST ===");
            Map<String, Object> chartData = userService.getCustomersChartData();
            System.out.println("Customers chart data: " + chartData);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", chartData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Error getting customers chart: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy thống kê khách hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}