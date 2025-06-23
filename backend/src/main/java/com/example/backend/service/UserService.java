package com.example.backend.service;

import com.example.backend.dto.AuthResponseDto;
import com.example.backend.dto.UserLoginDto;
import com.example.backend.dto.UserRegistrationDto;
import com.example.backend.dto.AdminUserCreationDto;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}
