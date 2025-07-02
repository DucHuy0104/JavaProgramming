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
            fb.setStatus(status);
            feedbackRepository.save(fb);
        });
        return feedbackOpt;
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
