package com.example.backend.controller;

import com.example.backend.entity.TestResult;
import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import com.example.backend.service.TestResultService;
import com.example.backend.service.UserService;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = "*")
public class TestResultController {
    @Autowired
    private TestResultService testResultService;
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;

    // Tạo mới kết quả xét nghiệm (staff/admin)
    @PostMapping
    public ResponseEntity<?> createTestResult(@RequestBody TestResult testResult) {
        TestResult created = testResultService.createTestResult(testResult);
        return ResponseEntity.ok(created);
    }

    // Cập nhật kết quả xét nghiệm (staff/admin)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTestResult(@PathVariable Long id, @RequestBody TestResult testResult) {
        TestResult updated = testResultService.updateTestResult(id, testResult);
        return ResponseEntity.ok(updated);
    }

    // Xóa kết quả xét nghiệm (staff/admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTestResult(@PathVariable Long id) {
        testResultService.deleteTestResult(id);
        return ResponseEntity.ok().build();
    }

    // Duyệt kết quả xét nghiệm (staff/admin)
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveTestResult(@PathVariable Long id) {
        TestResult approved = testResultService.approveTestResult(id);
        return ResponseEntity.ok(approved);
    }

    // Lấy kết quả theo id (admin/staff hoặc khách hàng chỉ xem của mình)
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id, Principal principal) {
        Optional<TestResult> resultOpt = testResultService.getById(id);
        if (resultOpt.isEmpty()) return ResponseEntity.notFound().build();
        TestResult result = resultOpt.get();
        // Nếu là khách hàng, chỉ cho xem kết quả của mình
        if (isCustomer(principal)) {
            User user = getCurrentUser(principal);
            if (result.getOrder() == null || result.getOrder().getCustomer() == null ||
                !result.getOrder().getCustomer().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền xem kết quả này!");
            }
        }
        return ResponseEntity.ok(result);
    }

    // Lấy kết quả theo orderId
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getByOrderId(@PathVariable Long orderId, Principal principal) {
        Optional<TestResult> resultOpt = testResultService.getByOrderId(orderId);
        if (resultOpt.isEmpty()) return ResponseEntity.notFound().build();
        TestResult result = resultOpt.get();
        // Nếu là khách hàng, chỉ cho xem kết quả của mình
        if (isCustomer(principal)) {
            User user = getCurrentUser(principal);
            if (result.getOrder() == null || result.getOrder().getCustomer() == null ||
                !result.getOrder().getCustomer().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Bạn không có quyền xem kết quả này!");
            }
        }
        return ResponseEntity.ok(result);
    }

    // Lấy tất cả kết quả của 1 staff (admin/staff)
    @GetMapping("/staff/{staffId}")
    public ResponseEntity<?> getByStaff(@PathVariable Long staffId) {
        User staff = userService.findById(staffId).orElse(null);
        if (staff == null) return ResponseEntity.notFound().build();
        List<TestResult> results = testResultService.getByStaff(staff);
        return ResponseEntity.ok(results);
    }

    // Lấy tất cả kết quả của 1 khách hàng (admin/staff hoặc chính khách hàng)
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getByCustomer(@PathVariable Long customerId, Principal principal) {
        // Nếu là khách hàng, chỉ cho xem của mình
        if (isCustomer(principal)) {
            User user = getCurrentUser(principal);
            if (!user.getId().equals(customerId)) {
                return ResponseEntity.status(403).body("Bạn không có quyền xem kết quả này!");
            }
        }
        List<TestResult> results = testResultService.getByCustomerId(customerId);
        return ResponseEntity.ok(results);
    }

    // Lấy tất cả kết quả theo trạng thái (admin/staff)
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getByStatus(@PathVariable String status) {
        List<TestResult> results = testResultService.getByStatus(status);
        return ResponseEntity.ok(results);
    }

    // Helper: xác định user hiện tại
    private User getCurrentUser(Principal principal) {
        if (principal == null) return null;
        return userService.findByEmail(principal.getName()).orElse(null);
    }
    // Helper: xác định có phải khách hàng không
    private boolean isCustomer(Principal principal) {
        User user = getCurrentUser(principal);
        return user != null && "CUSTOMER".equalsIgnoreCase(user.getRole());
    }
} 