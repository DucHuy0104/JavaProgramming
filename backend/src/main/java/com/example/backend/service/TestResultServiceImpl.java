package com.example.backend.service;

import com.example.backend.entity.TestResult;
import com.example.backend.entity.User;
import com.example.backend.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestResultServiceImpl implements TestResultService {
    @Autowired
    private TestResultRepository testResultRepository;

    @Override
    public TestResult createTestResult(TestResult testResult) {
        return testResultRepository.save(testResult);
    }

    @Override
    public TestResult updateTestResult(Long id, TestResult testResult) {
        testResult.setId(id);
        return testResultRepository.save(testResult);
    }

    @Override
    public void deleteTestResult(Long id) {
        testResultRepository.deleteById(id);
    }

    @Override
    public TestResult approveTestResult(Long id) {
        Optional<TestResult> opt = testResultRepository.findById(id);
        if (opt.isPresent()) {
            TestResult result = opt.get();
            result.setStatus("approved");
            return testResultRepository.save(result);
        }
        return null;
    }

    @Override
    public Optional<TestResult> getById(Long id) {
        return testResultRepository.findById(id);
    }

    @Override
    public Optional<TestResult> getByOrderId(Long orderId) {
        return testResultRepository.findByOrder_Id(orderId);
    }

    @Override
    public List<TestResult> getByStaff(User staff) {
        return testResultRepository.findByStaff(staff);
    }

    @Override
    public List<TestResult> getByCustomerId(Long customerId) {
        throw new UnsupportedOperationException("getByCustomerId(Long) không còn được hỗ trợ, hãy dùng getByCustomerName(String)");
    }

    @Override
    public List<TestResult> getByStatus(String status) {
        return testResultRepository.findByStatus(status);
    }

    public List<TestResult> getByCustomerName(String customerName) {
        return testResultRepository.findByOrderCustomerName(customerName);
    }

    @Override
    public void deleteByOrderId(Long orderId) {
        Optional<TestResult> testResultOpt = testResultRepository.findByOrder_Id(orderId);
        if (testResultOpt.isPresent()) {
            testResultRepository.delete(testResultOpt.get());
        }
    }
}
