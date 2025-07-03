package com.example.backend.service;

import com.example.backend.entity.AdminLog;
import com.example.backend.repository.AdminLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminLogService {
    @Autowired
    private AdminLogRepository adminLogRepository;

    public Optional<AdminLog> getAdminLogById(Long id) {
        return adminLogRepository.findById(id);
    }

    public AdminLog saveAdminLog(AdminLog adminLog) {
        return adminLogRepository.save(adminLog);
    }

    public void deleteAdminLog(Long id) {
        if (!adminLogRepository.existsById(id)) {
            throw new RuntimeException("Admin log không tồn tại!");
        }
        adminLogRepository.deleteById(id);
    }

    public long countAdminLogs() {
        return adminLogRepository.count();
    }
}