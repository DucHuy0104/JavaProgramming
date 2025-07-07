package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {
    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> sendContactMail(@RequestBody Map<String, String> payload) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("trinhminhkhangcn23@gmail.com");
            message.setSubject("Liên hệ mới: " + payload.get("subject"));
            message.setText(
                "Họ tên: " + payload.get("name") + "\n" +
                "Email: " + payload.get("email") + "\n" +
                "SĐT: " + payload.get("phone") + "\n" +
                "Nội dung: " + payload.get("message")
            );
            mailSender.send(message);
            return ResponseEntity.ok("Đã gửi email thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Gửi email thất bại!");
        }
    }
}
