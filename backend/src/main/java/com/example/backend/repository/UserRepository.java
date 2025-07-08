package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Find user by phone number
    Optional<User> findByPhoneNumber(String phoneNumber);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Check if phone number exists
    boolean existsByPhoneNumber(String phoneNumber);
    
    // Find users by role
    List<User> findByRole(String role);
    
    // Find users by status
    List<User> findByStatus(String status);
    
    // Find users by role and status
    List<User> findByRoleAndStatus(String role, String status);
    
    // Search users by name (case insensitive)
    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByFullNameContainingIgnoreCase(@Param("name") String name);
    
    // Find users by email or phone number
    @Query("SELECT u FROM User u WHERE u.email = :emailOrPhone OR u.phoneNumber = :emailOrPhone")
    Optional<User> findByEmailOrPhoneNumber(@Param("emailOrPhone") String emailOrPhone);
    
    // Count users by role
    long countByRole(String role);
    
    // Count users by status
    long countByStatus(String status);

    // Đếm số khách hàng mới theo tháng trong năm hiện tại
    @Query("SELECT MONTH(u.createdAt) as month, COUNT(u) as count FROM User u WHERE u.role = 'CUSTOMER' AND u.status = 'ACTIVE' AND YEAR(u.createdAt) = :year GROUP BY MONTH(u.createdAt) ORDER BY month")
    List<Object[]> countNewCustomersByMonth(@Param("year") int year);
}
