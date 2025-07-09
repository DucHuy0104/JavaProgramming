package com.example.backend.controller;

import com.example.backend.entity.Order;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileUploadController {

    @Autowired
    private OrderService orderService;

    // Thư mục lưu file uploads
    private final String UPLOAD_DIR = "uploads/test-results/";

    @PostMapping("/upload-result/{orderId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER') or hasAuthority('ROLE_STAFF')")
    public ResponseEntity<?> uploadTestResult(@PathVariable Long orderId, @RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            System.out.println("=== UPLOAD TEST RESULT REQUEST ===");
            System.out.println("Order ID: " + orderId);
            System.out.println("File name: " + file.getOriginalFilename());
            System.out.println("File size: " + file.getSize());
            System.out.println("Authentication: " + authentication);
            System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));

            // Kiểm tra file có phải PDF không
            if (!file.getContentType().equals("application/pdf")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Chỉ chấp nhận file PDF");
                return ResponseEntity.badRequest().body(response);
            }

            // Kiểm tra order có tồn tại không
            Order order = orderService.getOrderByIdDirect(orderId);
            if (order == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy đơn hàng");
                return ResponseEntity.badRequest().body(response);
            }

            // Tạo thư mục nếu chưa tồn tại
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file unique
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = "result_" + orderId + "_" + UUID.randomUUID().toString() + fileExtension;

            // Lưu file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Cập nhật đường dẫn file trong database
            String relativePath = UPLOAD_DIR + uniqueFilename;
            order.setResultFilePath(relativePath);
            orderService.updateOrder(order);

            System.out.println(" File uploaded successfully: " + relativePath);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Upload file kết quả thành công!");
            response.put("filePath", relativePath);
            response.put("fileName", uniqueFilename);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println(" Error uploading file: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi upload file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.err.println(" Unexpected error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi không xác định: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/download-result/{orderId}")
    public ResponseEntity<Resource> downloadTestResult(@PathVariable Long orderId) {
        try {
            System.out.println("=== DOWNLOAD TEST RESULT REQUEST ===");
            System.out.println("Order ID: " + orderId);

            // Lấy thông tin order
            Order order = orderService.getOrderByIdDirect(orderId);
            if (order == null || order.getResultFilePath() == null) {
                return ResponseEntity.notFound().build();
            }

            // Lấy file
            Path filePath = Paths.get(order.getResultFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                System.err.println(" File not found or not readable: " + order.getResultFilePath());
                return ResponseEntity.notFound().build();
            }

            System.out.println(" File found, preparing download: " + order.getResultFilePath());

            // Tạo tên file download
            String downloadFilename = "KetQua_" + order.getOrderNumber() + ".pdf";

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFilename + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            System.err.println(" Error creating file URL: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println(" Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }



    // Upload ảnh cho blog
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    @PostMapping("/upload-blog-image")
    public ResponseEntity<Map<String, Object>> uploadBlogImage(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("=== UPLOAD BLOG IMAGE REQUEST ===");
            System.out.println("File name: " + file.getOriginalFilename());

            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "Vui lòng chọn file ảnh");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "Chỉ chấp nhận file ảnh (JPG, PNG, GIF)");
                return ResponseEntity.badRequest().body(response);
            }

            // Create upload directory trong frontend/src/assets
            // Get current working directory and navigate to frontend/src/assets
            Path currentDir = Paths.get("").toAbsolutePath();
            Path frontendAssetsPath = currentDir.getParent().resolve("frontend/src/assets");

            System.out.println("Current directory: " + currentDir);
            System.out.println("Frontend assets path: " + frontendAssetsPath);

            if (!Files.exists(frontendAssetsPath)) {
                Files.createDirectories(frontendAssetsPath);
                System.out.println("Created directory: " + frontendAssetsPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = "blog_" + System.currentTimeMillis() + fileExtension;

            // Save file
            Path filePath = frontendAssetsPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println(" Blog image uploaded successfully: " + filePath);

            response.put("success", true);
            response.put("message", "Upload ảnh thành công!");
            response.put("imagePath", "assets/" + uniqueFilename);
            response.put("imageUrl", "/api/files/blog-images/" + uniqueFilename);
            response.put("fileName", uniqueFilename);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("/*  */ Error uploading blog image: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Lỗi khi upload ảnh: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Serve blog images
    @GetMapping("/blog-images/{filename}")
    public ResponseEntity<Resource> serveBlogImage(@PathVariable String filename) {
        System.out.println("=== SERVE BLOG IMAGE REQUEST ===");
        System.out.println("Requested filename: " + filename);

        try {
            // Get path to frontend/src/assets
            Path currentDir = Paths.get("").toAbsolutePath();
            Path frontendAssetsPath = currentDir.getParent().resolve("frontend/src/assets");
            Path filePath = frontendAssetsPath.resolve(filename);

            System.out.println("Current directory: " + currentDir);
            System.out.println("Frontend assets path: " + frontendAssetsPath);
            System.out.println("Full file path: " + filePath);
            System.out.println("File exists: " + Files.exists(filePath));

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                System.err.println(" Blog image not found: " + filePath);
                System.err.println(" File exists check: " + Files.exists(filePath));
                return ResponseEntity.notFound().build();
            }

            if (!resource.isReadable()) {
                System.err.println(" Blog image not readable: " + filePath);
                return ResponseEntity.status(403).build();
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            System.out.println(" Serving blog image: " + filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                    .body(resource);

        } catch (Exception e) {
            System.err.println(" Error serving blog image: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete-result/{orderId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MANAGER')")
    public ResponseEntity<?> deleteTestResult(@PathVariable Long orderId) {
        try {
            System.out.println("=== DELETE TEST RESULT REQUEST ===");
            System.out.println("Order ID: " + orderId);

            // Lấy thông tin order
            Order order = orderService.getOrderByIdDirect(orderId);
            if (order == null || order.getResultFilePath() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không tìm thấy file kết quả");
                return ResponseEntity.badRequest().body(response);
            }

            // Xóa file vật lý
            Path filePath = Paths.get(order.getResultFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println(" Physical file deleted: " + order.getResultFilePath());
            }

            // Xóa đường dẫn trong database
            order.setResultFilePath(null);
            orderService.updateOrder(order);

            System.out.println(" File path removed from database");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa file kết quả thành công!");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println(" Error deleting file: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.err.println(" Unexpected error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi không xác định: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
