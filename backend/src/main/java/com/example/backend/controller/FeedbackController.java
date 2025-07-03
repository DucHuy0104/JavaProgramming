package com.example.backend.controller;

import com.example.backend.entity.Feedback;
import com.example.backend.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*") // Cho phép FE gọi API
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        feedback.setStatus("pending");
        feedback.setCreatedAt(LocalDateTime.now());
        return feedbackService.saveFeedback(feedback);
    }

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Optional<Feedback> feedbackOpt = feedbackService.updateStatus(id, status);
            Map<String, Object> response = new HashMap<>();

            if (feedbackOpt.isPresent()) {
                response.put("success", true);
                if ("rejected".equals(status)) {
                    response.put("message", "Feedback đã được từ chối và xóa thành công");
                    response.put("deleted", true);
                } else {
                    response.put("message", "Cập nhật trạng thái feedback thành công");
                    response.put("data", feedbackOpt.get());
                }
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Không tìm thấy feedback với ID: " + id);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi cập nhật feedback: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        try {
            boolean deleted = feedbackService.deleteFeedback(id);
            Map<String, Object> response = new HashMap<>();

            if (deleted) {
                response.put("success", true);
                response.put("message", "Feedback đã được xóa thành công");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Không tìm thấy feedback với ID: " + id);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi xóa feedback: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/{id}/reject")
    public ResponseEntity<?> rejectAndDeleteFeedback(@PathVariable Long id) {
        try {
            boolean deleted = feedbackService.rejectAndDeleteFeedback(id);
            Map<String, Object> response = new HashMap<>();

            if (deleted) {
                response.put("success", true);
                response.put("message", "Feedback đã được từ chối và xóa thành công");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Không tìm thấy feedback với ID: " + id);
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lỗi khi từ chối và xóa feedback: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
