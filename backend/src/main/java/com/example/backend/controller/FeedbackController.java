package com.example.backend.controller;

import com.example.backend.entity.Feedback;
import com.example.backend.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
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

    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
    }

    @PutMapping("/{id}/status")
    public Optional<Feedback> updateStatus(@PathVariable Long id, @RequestParam String status) {
        if ("rejected".equals(status)) {
            feedbackService.deleteFeedback(id);
            return Optional.empty();
        }
        return feedbackService.updateStatus(id, status);
    }
}
