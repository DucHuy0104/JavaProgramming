package com.example.backend.service;

import com.example.backend.entity.Feedback;
import com.example.backend.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback saveFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> updateStatus(Long id, String status) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(id);
        feedbackOpt.ifPresent(fb -> {
            if ("rejected".equals(status)) {
                // Tự động xóa feedback khi từ chối
                feedbackRepository.delete(fb);
            } else {
                // Chỉ cập nhật status cho approved
                fb.setStatus(status);
                feedbackRepository.save(fb);
            }
        });
        return feedbackOpt;
    }

    // Xóa feedback
    public boolean deleteFeedback(Long id) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(id);
        if (feedbackOpt.isPresent()) {
            feedbackRepository.delete(feedbackOpt.get());
            return true;
        }
        return false;
    }

    // Từ chối và xóa feedback
    public boolean rejectAndDeleteFeedback(Long id) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(id);
        if (feedbackOpt.isPresent()) {
            feedbackRepository.delete(feedbackOpt.get());
            return true;
        }
        return false;
    }
}
