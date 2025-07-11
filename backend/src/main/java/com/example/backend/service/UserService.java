package com.example.backend.service;

import java.util.List;
import java.util.Optional;
import java.time.Year;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.AdminUserCreationDto;
import com.example.backend.dto.ChangePasswordDto;
import com.example.backend.dto.UpdateProfileDto;
import com.example.backend.dto.UserLoginDto;
import com.example.backend.dto.UserRegistrationDto;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register new user (PUBLIC - only CUSTOMER role allowed)
    public User registerUser(UserRegistrationDto registrationDto) {
        // Check if email already exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Check if phone number already exists
        if (registrationDto.getPhoneNumber() != null && 
            userRepository.existsByPhoneNumber(registrationDto.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng!");
        }

        // Check if passwords match
        if (!registrationDto.getPassword().equals(registrationDto.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp!");
        }

        // Create new user
        User user = new User();
        user.setFullName(registrationDto.getFullName());
        user.setEmail(registrationDto.getEmail());
        user.setPhoneNumber(registrationDto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setAddress(registrationDto.getAddress());
        user.setDateOfBirth(registrationDto.getDateOfBirth());
        user.setGender(registrationDto.getGender());
        user.setRole("CUSTOMER"); // ONLY CUSTOMER role allowed for public registration
        user.setStatus("ACTIVE");

        return userRepository.save(user);
    }

    // Create admin/manager/staff user (ADMIN ONLY)
    public User createAdminUser(AdminUserCreationDto adminUserDto, String creatorRole) {
        // Only ADMIN can create admin/manager/staff accounts
        if (!"ADMIN".equals(creatorRole)) {
            throw new RuntimeException("Chỉ ADMIN mới có quyền tạo tài khoản quản trị!");
        }

        // Validate role
        if (!isValidAdminRole(adminUserDto.getRole())) {
            throw new RuntimeException("Role không hợp lệ! Chỉ được phép: ADMIN, MANAGER, STAFF");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(adminUserDto.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Check if phone number already exists (if provided)
        if (adminUserDto.getPhoneNumber() != null &&
            userRepository.existsByPhoneNumber(adminUserDto.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng!");
        }

        // Create new admin user
        User user = new User();
        user.setFullName(adminUserDto.getFullName());
        user.setEmail(adminUserDto.getEmail());
        user.setPhoneNumber(adminUserDto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(adminUserDto.getPassword()));
        user.setAddress(adminUserDto.getAddress());
        user.setDateOfBirth(adminUserDto.getDateOfBirth());
        user.setGender(adminUserDto.getGender());
        user.setRole(adminUserDto.getRole()); // ADMIN, MANAGER, or STAFF
        user.setStatus("ACTIVE");

        return userRepository.save(user);
    }

    private boolean isValidAdminRole(String role) {
        return "ADMIN".equals(role) || "MANAGER".equals(role) || "STAFF".equals(role);
    }

    // Login user
    public User loginUser(UserLoginDto loginDto) {
        // Find user by email or phone number
        Optional<User> userOptional = userRepository.findByEmailOrPhoneNumber(loginDto.getEmailOrPhone());

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Tài khoản không tồn tại!");
        }

        User user = userOptional.get();

        // Check if user is active
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new RuntimeException("Tài khoản đã bị khóa hoặc chưa được kích hoạt!");
        }

        // Check password
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        return user;
    }

    // Find user by ID
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // Find user by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get users by role
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    // Get users by status
    public List<User> getUsersByStatus(String status) {
        return userRepository.findByStatus(status);
    }

    // Update user
    public User updateUser(Long id, User updatedUser) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Người dùng không tồn tại!");
        }

        User user = userOptional.get();
        user.setFullName(updatedUser.getFullName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setAddress(updatedUser.getAddress());
        user.setDateOfBirth(updatedUser.getDateOfBirth());
        user.setGender(updatedUser.getGender());

        return userRepository.save(user);
    }

    // Update user (overloaded method)
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Người dùng không tồn tại!");
        }
        userRepository.deleteById(id);
    }

    // Change user status
    public User changeUserStatus(Long id, String status) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Người dùng không tồn tại!");
        }

        User user = userOptional.get();
        user.setStatus(status);
        return userRepository.save(user);
    }

    // Search users by name
    public List<User> searchUsersByName(String name) {
        return userRepository.findByFullNameContainingIgnoreCase(name);
    }

    // Update user profile
    public User updateProfile(Long userId, UpdateProfileDto profileDto) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Người dùng không tồn tại!");
        }

        User user = userOptional.get();

        System.out.println("=== UPDATE PROFILE DEBUG ===");
        System.out.println("Current user phone: '" + user.getPhoneNumber() + "'");
        System.out.println("New phone from DTO: '" + profileDto.getPhoneNumber() + "'");
        System.out.println("Current user email: '" + user.getEmail() + "'");
        System.out.println("New email from DTO: '" + profileDto.getEmail() + "'");

        // Check if email is being changed and already exists
        if (!user.getEmail().equals(profileDto.getEmail()) &&
            userRepository.existsByEmail(profileDto.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Check if phone number is being changed and already exists
        String newPhoneNumber = profileDto.getPhoneNumber();
        String currentPhoneNumber = user.getPhoneNumber();

        // Normalize empty strings to null for comparison
        if (newPhoneNumber != null && newPhoneNumber.trim().isEmpty()) {
            newPhoneNumber = null;
        }
        if (currentPhoneNumber != null && currentPhoneNumber.trim().isEmpty()) {
            currentPhoneNumber = null;
        }

        // Only check for duplicates if phone number is actually changing and not empty
        if (newPhoneNumber != null &&
            !newPhoneNumber.equals(currentPhoneNumber) &&
            userRepository.existsByPhoneNumber(newPhoneNumber)) {
            throw new RuntimeException("Số điện thoại đã được sử dụng!");
        }

        // Update user fields
        user.setFullName(profileDto.getFullName());
        user.setEmail(profileDto.getEmail());
        user.setPhoneNumber(profileDto.getPhoneNumber());
        user.setAddress(profileDto.getAddress());
        user.setDateOfBirth(profileDto.getDateOfBirth());
        user.setGender(profileDto.getGender());

        return userRepository.save(user);
    }

    // Change password
    public void changePassword(Long userId, ChangePasswordDto passwordDto) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Người dùng không tồn tại!");
        }

        User user = userOptional.get();

        // Check if passwords match
        if (!passwordDto.getNewPassword().equals(passwordDto.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp!");
        }

        // Verify current password
        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu hiện tại không đúng!");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(passwordDto.getNewPassword()));
        userRepository.save(user);
    }

    // Dashboard statistics methods
    public long countCustomers() {
        return userRepository.countByRole("CUSTOMER");
    }

    public long countTotalUsers() {
        return userRepository.count();
    }

    public Map<String, Object> getCustomersChartData() {
        int year = Year.now().getValue();
        List<Object[]> results = userRepository.countNewCustomersByMonth(year);
        // Chuẩn bị labels và data cho 12 tháng
        String[] labels = new String[12];
        int[] data = new int[12];
        for (int i = 0; i < 12; i++) {
            labels[i] = "Tháng " + (i + 1);
            data[i] = 0;
        }
        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            int count = ((Number) row[1]).intValue();
            labels[month - 1] = "Tháng " + month;
            data[month - 1] = count;
        }
        // Tính growth (tăng trưởng so với trung bình 3 tháng gần nhất)
        int growth = 0;
        // Tìm tháng hiện tại (tháng cuối cùng có dữ liệu)
        int currentMonth = Year.now().getValue() == year ? LocalDate.now().getMonthValue() : 12;
        int currentIndex = currentMonth - 1;
        
        // Tính trung bình 3 tháng gần nhất (trừ tháng hiện tại)
        double avgPreviousMonths = 0;
        int validMonths = 0;
        for (int i = Math.max(0, currentIndex - 3); i < currentIndex; i++) {
            if (data[i] > 0) {
                avgPreviousMonths += data[i];
                validMonths++;
            }
        }
        
        if (validMonths > 0) {
            avgPreviousMonths = avgPreviousMonths / validMonths;
            if (avgPreviousMonths > 0) {
                growth = (int) Math.round(((double) (data[currentIndex] - avgPreviousMonths) / avgPreviousMonths) * 100);
            } else if (data[currentIndex] > 0) {
                growth = 25; // Tăng trưởng vừa phải khi có khách hàng mới
            }
        } else if (data[currentIndex] > 0) {
            growth = 25; // Tăng trưởng vừa phải khi có khách hàng mới
        } else {
            growth = 0; // Không có tăng trưởng
        }
        Map<String, Object> chart = new HashMap<>();
        chart.put("labels", labels);
        chart.put("data", data);
        chart.put("growth", growth);
        return chart;
    }
}
