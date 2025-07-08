package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import com.example.backend.service.TestResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private TestResultService testResultService;

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

        // Nếu trạng thái chuyển thành "results_delivered", tự động gửi thông báo đến người dùng
        if (result != null && "results_delivered".equals(update.getStatus())) {
            System.out.println("🎉 Order " + id + " results delivered! File is now available for customer download.");
            // TODO: Có thể thêm logic gửi email thông báo ở đây nếu cần
        }

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

    // API để xóa order (admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id, Authentication authentication) {
        try {
            // Kiểm tra quyền admin
            String email = authentication.getName();
            Optional<User> userOpt = userService.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("Không tìm thấy user");
            }
            
            User user = userOpt.get();
            if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body("Chỉ admin mới có quyền xóa order");
            }

            // Kiểm tra order có tồn tại không
            Optional<Order> orderOpt = orderService.getOrderById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Không tìm thấy order với ID: " + id);
            }

            // Xóa test result trước (nếu có)
            try {
                testResultService.deleteByOrderId(id);
            } catch (Exception e) {
                // Log lỗi nhưng vẫn tiếp tục xóa order
                System.out.println("Warning: Could not delete test result for order " + id + ": " + e.getMessage());
            }

            // Xóa order
            orderService.deleteOrder(id);
            
            return ResponseEntity.ok().body("Đã xóa order thành công");
            
        } catch (Exception e) {
            System.err.println("Error deleting order " + id + ": " + e.getMessage());
            return ResponseEntity.status(500).body("Lỗi khi xóa order: " + e.getMessage());
        }
    }

    // Lấy order theo order number
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<?> getOrderByNumber(@PathVariable String orderNumber) {
        try {
            System.out.println("=== GET ORDER BY NUMBER REQUEST ===");
            System.out.println("Order Number: " + orderNumber);

            Optional<Order> orderOpt = orderService.getOrderByNumber(orderNumber);
            if (orderOpt.isPresent()) {
                System.out.println("✅ Order found: " + orderOpt.get().getId());

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", orderOpt.get());
                return ResponseEntity.ok(response);
            } else {
                System.out.println("❌ Order not found with number: " + orderNumber);

                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy đơn hàng với mã: " + orderNumber);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("❌ Error getting order by number: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tìm kiếm đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}