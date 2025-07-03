package com.example.backend.repository;

import com.example.backend.entity.TestResult;
import com.example.backend.entity.Order;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    // Tìm kết quả xét nghiệm theo đơn hàng.
    Optional<TestResult> findByOrder(Order order);

    // Tìm kết quả xét nghiệm theo ID đơn hàng.
    Optional<TestResult> findByOrderId(Long orderId);

    // Lấy danh sách kết quả xét nghiệm theo nhân viên thực hiện.
    List<TestResult> findByStaff(User staff);

    // Lấy danh sách kết quả xét nghiệm theo trạng thái.
    List<TestResult> findByStatus(String status);

    // Lấy danh sách kết quả xét nghiệm theo ID khách hàng.
    List<TestResult> findByOrder_Customer_Id(Long customerId);

    // Lấy danh sách kết quả xét nghiệm theo trạng thái và nhân viên thực hiện.
    List<TestResult> findByStatusAndStaff(String status, User staff);

    // Lấy danh sách kết quả xét nghiệm theo trạng thái và ID khách hàng.
    List<TestResult> findByStatusAndOrder_Customer_Id(String status, Long customerId);

    // Lấy danh sách kết quả xét nghiệm theo khoảng thời gian trả kết quả.
    List<TestResult> findByDeliveredAtBetween(LocalDateTime from, LocalDateTime to);

    // Lấy danh sách kết quả xét nghiệm theo nhân viên thực hiện và khoảng thời gian trả kết quả.
    List<TestResult> findByStaffAndDeliveredAtBetween(User staff, LocalDateTime from, LocalDateTime to);

    // Lấy danh sách kết quả xét nghiệm theo trạng thái và khoảng thời gian trả kết quả.
    List<TestResult> findByStatusAndDeliveredAtBetween(String status, LocalDateTime from, LocalDateTime to);

    // Lấy danh sách kết quả xét nghiệm theo nhân viên thực hiện, trạng thái và khoảng thời gian trả kết quả.
    long countByStatus(String status);

    // Đếm số lượng kết quả xét nghiệm theo nhân viên thực hiện.
    long countByStaff(User staff);

    // Đếm số lượng kết quả xét nghiệm theo trạng thái và nhân viên thực hiện.
    long countByOrder_Customer_Id(Long customerId);
}