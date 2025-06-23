package com.example.backend.controller;

import com.example.backend.entity.Blog;
import com.example.backend.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogController {

    @Autowired
    private BlogService blogService;

    // Get all published blogs with pagination
    @GetMapping
    public ResponseEntity<?> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Blog> blogs = blogService.getPublishedBlogs(page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", blogs.getContent());
            response.put("currentPage", blogs.getNumber());
            response.put("totalPages", blogs.getTotalPages());
            response.put("totalElements", blogs.getTotalElements());
            response.put("size", blogs.getSize());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get blog by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable Long id) {
        try {
            Optional<Blog> blogOptional = blogService.getBlogByIdAndIncrementView(id);
            
            if (blogOptional.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Blog không tồn tại!");
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", blogOptional.get());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Create new blog (Admin/Staff only)
    @PostMapping
    public ResponseEntity<?> createBlog(@RequestBody Blog blog) {
        try {
            Blog createdBlog = blogService.createBlog(blog);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo blog thành công!");
            response.put("data", createdBlog);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update blog
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBlog(@PathVariable Long id, @RequestBody Blog updatedBlog) {
        try {
            Blog blog = blogService.updateBlog(id, updatedBlog);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật blog thành công!");
            response.put("data", blog);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Delete blog
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBlog(@PathVariable Long id) {
        try {
            blogService.deleteBlog(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa blog thành công!");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get blogs by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getBlogsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Blog> blogs = blogService.getBlogsByCategory(category, page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", blogs.getContent());
            response.put("currentPage", blogs.getNumber());
            response.put("totalPages", blogs.getTotalPages());
            response.put("totalElements", blogs.getTotalElements());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get featured blogs
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedBlogs() {
        try {
            List<Blog> blogs = blogService.getFeaturedBlogs();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", blogs);
            response.put("total", blogs.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Search blogs
    @GetMapping("/search")
    public ResponseEntity<?> searchBlogs(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Blog> blogs = blogService.searchBlogs(keyword, page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", blogs.getContent());
            response.put("currentPage", blogs.getNumber());
            response.put("totalPages", blogs.getTotalPages());
            response.put("totalElements", blogs.getTotalElements());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Publish blog
    @PatchMapping("/{id}/publish")
    public ResponseEntity<?> publishBlog(@PathVariable Long id) {
        try {
            Blog blog = blogService.publishBlog(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xuất bản blog thành công!");
            response.put("data", blog);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Unpublish blog
    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishBlog(@PathVariable Long id) {
        try {
            Blog blog = blogService.unpublishBlog(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Hủy xuất bản blog thành công!");
            response.put("data", blog);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Set featured blog
    @PatchMapping("/{id}/featured")
    public ResponseEntity<?> setFeaturedBlog(@PathVariable Long id, @RequestParam boolean featured) {
        try {
            Blog blog = blogService.setFeaturedBlog(id, featured);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", featured ? "Đặt blog nổi bật thành công!" : "Hủy blog nổi bật thành công!");
            response.put("data", blog);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get recent blogs
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Page<Blog> blogs = blogService.getRecentBlogs(page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", blogs.getContent());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get top viewed blogs
    @GetMapping("/popular")
    public ResponseEntity<?> getTopViewedBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            Page<Blog> blogs = blogService.getTopViewedBlogs(page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", blogs.getContent());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
