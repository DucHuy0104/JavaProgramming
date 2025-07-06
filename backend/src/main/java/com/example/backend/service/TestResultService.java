package com.example.backend.service;

import com.example.backend.entity.TestResult;
import com.example.backend.entity.User;
import java.util.List;
import java.util.Optional;

public interface TestResultService {
    TestResult createTestResult(TestResult testResult);
    TestResult updateTestResult(Long id, TestResult testResult);
    void deleteTestResult(Long id);
    TestResult approveTestResult(Long id);
    Optional<TestResult> getById(Long id);
    Optional<TestResult> getByOrderId(Long orderId);
    List<TestResult> getByStaff(User staff);
    List<TestResult> getByCustomerId(Long customerId);
    List<TestResult> getByStatus(String status);
    void deleteByOrderId(Long orderId);
} 