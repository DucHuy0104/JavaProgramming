package com.example.backend.controller;

import com.example.backend.dto.ServiceDto;
import com.example.backend.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @Autowired
    private ServiceService serviceService;
    
    // Test API để kiểm tra dịch vụ trang chủ
    @GetMapping("/homepage-services")
    public ResponseEntity<?> testHomepageServices() {
        try {
            List<ServiceDto> services = serviceService.getHomepageServices();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test homepage services thành công");
            response.put("data", services);
            response.put("count", services.size());
            
            // Thêm thông tin chi tiết cho test
            Map<String, Object> details = new HashMap<>();
            for (ServiceDto service : services) {
                details.put(service.getCategory(), Map.of(
                    "id", service.getId(),
                    "name", service.getName(),
                    "price", service.getPrice(),
                    "features", service.getFeatures() != null ? service.getFeatures().size() : 0
                ));
            }
            response.put("details", details);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi test: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Test API để kiểm tra admin services với filter
    @GetMapping("/admin-services")
    public ResponseEntity<?> testAdminServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isActive) {
        try {
            Map<String, Object> result = serviceService.getAllServicesForAdmin(page, size, sortBy, sortDir, search, category, isActive);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test admin services thành công");
            response.putAll(result);
            
            // Thêm thông tin test
            response.put("testParams", Map.of(
                "page", page,
                "size", size,
                "sortBy", sortBy,
                "sortDir", sortDir,
                "search", search != null ? search : "null",
                "category", category != null ? category : "null",
                "isActive", isActive != null ? isActive.toString() : "null"
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi test admin services: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Test API để kiểm tra database connection
    @GetMapping("/db-connection")
    public ResponseEntity<?> testDatabaseConnection() {
        try {
            List<ServiceDto> allServices = serviceService.getAllActiveServices();
            long totalCount = allServices.size();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database connection OK");
            response.put("totalActiveServices", totalCount);
            
            // Thống kê theo category
            Map<String, Long> categoryStats = new HashMap<>();
            categoryStats.put("DNA_HOME", serviceService.getServiceCountByCategory("DNA_HOME"));
            categoryStats.put("DNA_PROFESSIONAL", serviceService.getServiceCountByCategory("DNA_PROFESSIONAL"));
            categoryStats.put("DNA_FACILITY", serviceService.getServiceCountByCategory("DNA_FACILITY"));
            
            response.put("categoryStats", categoryStats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Database connection failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Test API để tạo dữ liệu mẫu
    @PostMapping("/create-sample-data")
    public ResponseEntity<?> createSampleData() {
        try {
            // Tạo thêm một số dịch vụ mẫu nếu cần
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sample data creation endpoint ready");
            response.put("note", "Implement sample data creation logic here if needed");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error creating sample data: " + e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}
