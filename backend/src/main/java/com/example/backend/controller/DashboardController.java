package com.example.backend.controller;

import com.example.backend.service.ProfileService;
import com.example.backend.service.TransactionService;
import com.example.backend.service.AdminLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    @Autowired
    private ProfileService profileService;
    @Autowired
    private TransactionService transactionService;
    @Autowired
    private AdminLogService adminLogService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalProfiles", profileService.countProfiles());
            stats.put("totalTransactions", transactionService.countTransactions());
            stats.put("totalAdminLogs", adminLogService.countAdminLogs());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}