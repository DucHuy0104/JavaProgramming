package com.example.backend.controller;

import com.example.backend.dto.ServiceDto;
import com.example.backend.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;
    
    // Lấy tất cả dịch vụ đang hoạt động (Public)
    @GetMapping
    public ResponseEntity<?> getAllServices() {
        try {
            List<ServiceDto> services = serviceService.getAllActiveServices();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy danh sách dịch vụ thành công");
            response.put("data", services);
            response.put("total", services.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách dịch vụ: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Lấy dịch vụ theo category (Public)
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getServicesByCategory(@PathVariable String category) {
        try {
            List<ServiceDto> services = serviceService.getServicesByCategory(category);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy dịch vụ theo danh mục thành công");
            response.put("data", services);
            response.put("category", category);
            response.put("total", services.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy dịch vụ theo danh mục: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Tìm kiếm dịch vụ theo tên (Public)
    @GetMapping("/search")
    public ResponseEntity<?> searchServices(@RequestParam String name) {
        try {
            List<ServiceDto> services = serviceService.searchServicesByName(name);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tìm kiếm dịch vụ thành công");
            response.put("data", services);
            response.put("searchTerm", name);
            response.put("total", services.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tìm kiếm dịch vụ: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Lấy dịch vụ theo khoảng giá (Public)
    @GetMapping("/price-range")
    public ResponseEntity<?> getServicesByPriceRange(
            @RequestParam Double minPrice, 
            @RequestParam Double maxPrice) {
        try {
            List<ServiceDto> services = serviceService.getServicesByPriceRange(minPrice, maxPrice);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy dịch vụ theo khoảng giá thành công");
            response.put("data", services);
            response.put("priceRange", Map.of("min", minPrice, "max", maxPrice));
            response.put("total", services.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy dịch vụ theo khoảng giá: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Lấy dịch vụ theo ID (Public)
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        try {
            Optional<ServiceDto> service = serviceService.getServiceById(id);
            
            if (service.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Lấy thông tin dịch vụ thành công");
                response.put("data", service.get());
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy dịch vụ với ID: " + id);
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy thông tin dịch vụ: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Tạo dịch vụ mới (Admin only) - Temporary public for testing
    @PostMapping
    public ResponseEntity<?> createService(@Valid @RequestBody ServiceDto serviceDto) {
        try {
            ServiceDto createdService = serviceService.createService(serviceDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo dịch vụ mới thành công");
            response.put("data", createdService);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi tạo dịch vụ: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Cập nhật dịch vụ (Admin only) - Temporary public for testing
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @Valid @RequestBody ServiceDto serviceDto) {
        try {
            ServiceDto updatedService = serviceService.updateService(id, serviceDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật dịch vụ thành công");
            response.put("data", updatedService);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật dịch vụ: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Xóa dịch vụ (soft delete - Admin only) - Temporary public for testing
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            serviceService.deleteService(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa dịch vụ thành công (soft delete)");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa dịch vụ: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Kích hoạt lại dịch vụ (Admin only) - Temporary public for testing
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<?> reactivateService(@PathVariable Long id) {
        try {
            ServiceDto reactivatedService = serviceService.reactivateService(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Kích hoạt lại dịch vụ thành công");
            response.put("data", reactivatedService);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi kích hoạt lại dịch vụ: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Xóa dịch vụ vĩnh viễn (hard delete - Admin only) - Temporary public for testing
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<?> hardDeleteService(@PathVariable Long id) {
        try {
            serviceService.hardDeleteService(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa dịch vụ vĩnh viễn thành công");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa dịch vụ vĩnh viễn: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Lấy thống kê dịch vụ (Admin only)
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getServiceStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("DNA_HOME", serviceService.getServiceCountByCategory("DNA_HOME"));
            stats.put("DNA_PROFESSIONAL", serviceService.getServiceCountByCategory("DNA_PROFESSIONAL"));
            stats.put("DNA_FACILITY", serviceService.getServiceCountByCategory("DNA_FACILITY"));
            stats.put("total", serviceService.getAllActiveServices().size());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy thống kê dịch vụ thành công");
            response.put("data", stats);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy thống kê dịch vụ: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Lấy dịch vụ mới nhất (Public)
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestServices(@RequestParam(defaultValue = "6") int limit) {
        try {
            List<ServiceDto> services = serviceService.getLatestServices(limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy dịch vụ mới nhất thành công");
            response.put("data", services);
            response.put("limit", limit);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy dịch vụ mới nhất: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // API cho trang chủ - Lấy 3 dịch vụ chính (Public)
    @GetMapping("/homepage")
    public ResponseEntity<?> getHomepageServices() {
        try {
            List<ServiceDto> services = serviceService.getHomepageServices();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy dịch vụ trang chủ thành công");
            response.put("data", services);
            response.put("total", services.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy dịch vụ trang chủ: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // API cho admin - Lấy tất cả dịch vụ (bao gồm cả inactive) - Public for testing
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllServicesForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isActive) {
        try {
            Map<String, Object> result = serviceService.getAllServicesForAdmin(page, size, sortBy, sortDir, search, category, isActive);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy danh sách dịch vụ cho admin thành công");
            response.putAll(result);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách dịch vụ: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Bulk delete services (Admin only)
    @DeleteMapping("/admin/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkDeleteServices(@RequestBody List<Long> serviceIds) {
        try {
            int deletedCount = serviceService.bulkDeleteServices(serviceIds);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa " + deletedCount + " dịch vụ thành công");
            response.put("deletedCount", deletedCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa dịch vụ: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Bulk update service status (Admin only)
    @PatchMapping("/admin/bulk-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkUpdateServiceStatus(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> serviceIds = (List<Long>) request.get("serviceIds");
            Boolean isActive = (Boolean) request.get("isActive");

            int updatedCount = serviceService.bulkUpdateServiceStatus(serviceIds, isActive);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật trạng thái " + updatedCount + " dịch vụ thành công");
            response.put("updatedCount", updatedCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật trạng thái dịch vụ: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get service categories (Public)
    @GetMapping("/categories")
    public ResponseEntity<?> getServiceCategories() {
        try {
            Map<String, String> categories = new HashMap<>();
            categories.put("DNA_HOME", "Tự lấy mẫu tại nhà");
            categories.put("DNA_PROFESSIONAL", "Nhân viên thu mẫu tại nhà");
            categories.put("DNA_FACILITY", "Thử mẫu tại cơ sở");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy danh sách danh mục thành công");
            response.put("data", categories);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi lấy danh sách danh mục: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
