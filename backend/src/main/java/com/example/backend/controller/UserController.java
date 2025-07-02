package com.example.backend.controller;

import com.example.backend.dto.AuthResponseDto;
import com.example.backend.dto.UserLoginDto;
import com.example.backend.dto.UserRegistrationDto;
import com.example.backend.dto.AdminUserCreationDto;
import com.example.backend.dto.UpdateProfileDto;
import com.example.backend.dto.ChangePasswordDto;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import com.example.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import com.example.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    // Register new user (PUBLIC - only CUSTOMER role)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        try {
            User user = userService.registerUser(registrationDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng ký thành công!");
            response.put("user", Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "status", user.getStatus()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDto loginDto) {
        try {
            User user = userService.loginUser(loginDto);
            
            // Generate JWT token with redirect URL
            String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getRole());

            AuthResponseDto authResponse = new AuthResponseDto(token, user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đăng nhập thành công!");
            response.put("data", authResponse);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get all users (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            System.out.println("=== GET ALL USERS REQUEST ===");
            List<User> users = userService.getAllUsers();
            System.out.println("Total users found: " + users.size());

            // Debug: print each user
            for (User user : users) {
                System.out.println("User: " + user.getFullName() + " - " + user.getEmail() + " - " + user.getRole());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", users);
            response.put("total", users.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error getting all users: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userService.findById(id);
            
            if (userOptional.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại!");
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userOptional.get());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật thông tin thành công!");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE USER REQUEST ===");
            System.out.println("User ID to delete: " + id);

            userService.deleteUser(id);
            System.out.println("User deleted successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa người dùng thành công!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get users by role
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            List<User> users = userService.getUsersByRole(role);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", users);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Search users by name
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String name) {
        try {
            List<User> users = userService.searchUsersByName(name);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", users);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Change user status (Admin only)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changeUserStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            User user = userService.changeUserStatus(id, status);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật trạng thái thành công!");
            response.put("data", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Create admin/manager/staff user - TEMPORARILY DISABLED ALL SECURITY FOR DEBUG
    @PostMapping("/admin/create")
    public ResponseEntity<?> createAdminUser(@Valid @RequestBody AdminUserCreationDto adminUserDto) {
        try {
            System.out.println("=== CREATE ADMIN USER REQUEST (NO SECURITY) ===");
            System.out.println("Request data: " + adminUserDto);

            // Temporarily use ADMIN as default creator role
            String creatorRole = "ADMIN";
            System.out.println("Using default creator role: " + creatorRole);

            User user = userService.createAdminUser(adminUserDto, creatorRole);
            System.out.println("User created successfully: " + user.getFullName());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo tài khoản quản trị thành công!");
            response.put("data", user);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get admin/manager/staff users (ADMIN ONLY)
    @GetMapping("/admin/staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminStaffUsers() {
        try {
            System.out.println("=== GET ADMIN STAFF USERS REQUEST ===");

            List<User> adminUsers = userService.getUsersByRole("ADMIN");
            List<User> managerUsers = userService.getUsersByRole("MANAGER");
            List<User> staffUsers = userService.getUsersByRole("STAFF");

            System.out.println("Found " + adminUsers.size() + " admins");
            System.out.println("Found " + managerUsers.size() + " managers");
            System.out.println("Found " + staffUsers.size() + " staff");

            Map<String, Object> data = new HashMap<>();
            data.put("admins", adminUsers);
            data.put("managers", managerUsers);
            data.put("staff", staffUsers);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", data);
            response.put("total", adminUsers.size() + managerUsers.size() + staffUsers.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Add phone number to current user (if missing)
    @PostMapping("/add-phone")
    public ResponseEntity<?> addPhoneToCurrentUser(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String phoneNumber = request.get("phoneNumber");
            if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Số điện thoại không được để trống!");
                return ResponseEntity.badRequest().body(response);
            }

            String email = authentication.getName();
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại!");
                return ResponseEntity.notFound().build();
            }

            User user = userOptional.get();
            user.setPhoneNumber(phoneNumber.trim());
            userRepository.save(user);

            System.out.println("Added phone " + phoneNumber + " to user " + user.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã thêm số điện thoại thành công!");
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Emergency: Make user ADMIN by email (ONLY for development)
    @PostMapping("/make-admin/{email}")
    public ResponseEntity<?> makeUserAdmin(@PathVariable String email) {
        try {
            System.out.println("=== MAKE USER ADMIN ===");
            System.out.println("Email: " + email);

            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User không tồn tại với email: " + email);
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOptional.get();
            System.out.println("Found user: " + user.getFullName() + " - Current role: " + user.getRole());

            user.setRole("ADMIN");
            User updatedUser = userService.updateUser(user.getId(), user);

            System.out.println("User role updated to ADMIN successfully");

            // Generate new token with ADMIN role
            String newToken = jwtService.generateToken(updatedUser.getEmail(), updatedUser.getId(), updatedUser.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User " + email + " đã được set role ADMIN");
            response.put("user", updatedUser);
            response.put("newToken", newToken);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Make admin error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Emergency: Make first user ADMIN (ONLY for development)
    @PostMapping("/make-admin")
    public ResponseEntity<?> makeFirstUserAdmin() {
        try {
            System.out.println("=== MAKE FIRST USER ADMIN ===");

            List<User> allUsers = userService.getAllUsers();
            if (allUsers.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Không có user nào trong database");
                return ResponseEntity.badRequest().body(response);
            }

            // Lấy user đầu tiên và set role ADMIN
            User firstUser = allUsers.get(0);
            System.out.println("Making user ADMIN: " + firstUser.getEmail());

            firstUser.setRole("ADMIN");
            User updatedUser = userService.updateUser(firstUser.getId(), firstUser);

            System.out.println("User role updated successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User đầu tiên đã được set role ADMIN");
            response.put("user", updatedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Make admin error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Debug database endpoint
    @GetMapping("/debug-db")
    public ResponseEntity<?> debugDatabase() {
        try {
            System.out.println("=== DEBUG DATABASE ===");

            List<User> allUsers = userService.getAllUsers();
            System.out.println("Total users in database: " + allUsers.size());

            Map<String, Integer> roleCount = new HashMap<>();
            for (User user : allUsers) {
                String role = user.getRole();
                roleCount.put(role, roleCount.getOrDefault(role, 0) + 1);
                System.out.println("User: " + user.getId() + " - " + user.getFullName() + " - " + user.getEmail() + " - " + user.getRole() + " - " + user.getStatus());
                System.out.println("  Phone: '" + user.getPhoneNumber() + "' (length: " + (user.getPhoneNumber() != null ? user.getPhoneNumber().length() : "null") + ")");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalUsers", allUsers.size());
            response.put("roleCount", roleCount);
            response.put("users", allUsers);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Database debug error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Test create endpoint (simple)
    @PostMapping("/test-create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testCreate(@RequestBody Map<String, Object> testData, Authentication authentication) {
        try {
            System.out.println("=== TEST CREATE ENDPOINT ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));
            System.out.println("Test data received: " + testData);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test create endpoint working!");
            response.put("receivedData", testData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Test create error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Test admin role endpoint
    @GetMapping("/test-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testAdmin(Authentication authentication) {
        try {
            System.out.println("=== TEST ADMIN ENDPOINT ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin role test successful!");
            response.put("user", authentication != null ? authentication.getName() : "null");
            response.put("authorities", authentication != null ? authentication.getAuthorities() : "null");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }



    // Create sample data (ONLY for development)
    @PostMapping("/create-sample-data")
    public ResponseEntity<?> createSampleData() {
        try {
            System.out.println("=== CREATE SAMPLE DATA ===");

            // Check if data already exists
            List<User> existingUsers = userService.getAllUsers();
            if (!existingUsers.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Database đã có dữ liệu. Có " + existingUsers.size() + " users.");
                return ResponseEntity.badRequest().body(response);
            }

            // Create admin user
            UserRegistrationDto adminDto = new UserRegistrationDto();
            adminDto.setFullName("Admin User");
            adminDto.setEmail("admin@dnatesting.com");
            adminDto.setPassword("admin123");
            adminDto.setPhoneNumber("0123456789");
            adminDto.setAddress("Admin Address");
            adminDto.setDateOfBirth("1990-01-01");
            adminDto.setGender("Male");

            User adminUser = userService.registerUser(adminDto);
            adminUser.setRole("ADMIN");
            adminUser.setStatus("ACTIVE");
            userService.updateUser(adminUser.getId(), adminUser);

            // Create manager user
            UserRegistrationDto managerDto = new UserRegistrationDto();
            managerDto.setFullName("Manager User");
            managerDto.setEmail("manager@dnatesting.com");
            managerDto.setPassword("manager123");
            managerDto.setPhoneNumber("0123456790");
            managerDto.setAddress("Manager Address");
            managerDto.setDateOfBirth("1985-01-01");
            managerDto.setGender("Female");

            User managerUser = userService.registerUser(managerDto);
            managerUser.setRole("MANAGER");
            managerUser.setStatus("ACTIVE");
            userService.updateUser(managerUser.getId(), managerUser);

            // Create staff user
            UserRegistrationDto staffDto = new UserRegistrationDto();
            staffDto.setFullName("Staff User");
            staffDto.setEmail("staff@dnatesting.com");
            staffDto.setPassword("staff123");
            staffDto.setPhoneNumber("0123456791");
            staffDto.setAddress("Staff Address");
            staffDto.setDateOfBirth("1995-01-01");
            staffDto.setGender("Male");

            User staffUser = userService.registerUser(staffDto);
            staffUser.setRole("STAFF");
            staffUser.setStatus("ACTIVE");
            userService.updateUser(staffUser.getId(), staffUser);

            System.out.println("Sample data created successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Dữ liệu mẫu đã được tạo thành công!");
            response.put("users", List.of(
                Map.of("email", "admin@dnatesting.com", "password", "admin123", "role", "ADMIN"),
                Map.of("email", "manager@dnatesting.com", "password", "manager123", "role", "MANAGER"),
                Map.of("email", "staff@dnatesting.com", "password", "staff123", "role", "STAFF")
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Create sample data error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Test authentication endpoint
    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth(Authentication authentication) {
        try {
            System.out.println("=== TEST AUTH ENDPOINT ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("User: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Authorities: " + (authentication != null ? authentication.getAuthorities() : "null"));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Authentication working!");
            response.put("user", authentication != null ? authentication.getName() : "null");
            response.put("authorities", authentication != null ? authentication.getAuthorities() : "null");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }



    // Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        try {
            System.out.println("=== GET CURRENT USER PROFILE ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("User email: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Timestamp: " + java.time.LocalDateTime.now());

            String email = authentication.getName();
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                System.out.println("❌ User not found with email: " + email);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại!");
                return ResponseEntity.notFound().build();
            }

            User user = userOptional.get();
            System.out.println("✅ User found: " + user.getFullName());
            System.out.println("User phone: '" + user.getPhoneNumber() + "'");
            System.out.println("User phone is null: " + (user.getPhoneNumber() == null));
            System.out.println("User phone is empty: " + (user.getPhoneNumber() != null && user.getPhoneNumber().isEmpty()));
            System.out.println("User ID: " + user.getId());
            System.out.println("User email: " + user.getEmail());

            // Create manual user data map to ensure all fields are included
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("fullName", user.getFullName());
            userData.put("email", user.getEmail());
            userData.put("phoneNumber", user.getPhoneNumber());
            userData.put("address", user.getAddress());
            userData.put("dateOfBirth", user.getDateOfBirth());
            userData.put("gender", user.getGender());
            userData.put("role", user.getRole());
            userData.put("status", user.getStatus());

            System.out.println("Manual userData map: " + userData);
            System.out.println("Manual phoneNumber: '" + userData.get("phoneNumber") + "'");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Lấy thông tin thành công!");
            response.put("data", userData); // Use manual map instead of user object

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Get profile error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Update current user profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentUserProfile(@Valid @RequestBody UpdateProfileDto profileDto, Authentication authentication) {
        try {
            System.out.println("=== UPDATE PROFILE REQUEST ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("User email: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Profile data: " + profileDto);

            String email = authentication.getName();
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                System.out.println("❌ User not found with email: " + email);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại!");
                return ResponseEntity.notFound().build();
            }

            System.out.println("✅ User found, updating profile...");
            User user = userService.updateProfile(userOptional.get().getId(), profileDto);
            System.out.println("✅ Profile updated successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật thông tin thành công!");
            response.put("data", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Update profile error: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Change current user password
    @PutMapping("/change-password")
    public ResponseEntity<?> changeCurrentUserPassword(@Valid @RequestBody ChangePasswordDto passwordDto, Authentication authentication) {
        try {
            System.out.println("=== CHANGE PASSWORD REQUEST ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("User email: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Password DTO: " + passwordDto);

            String email = authentication.getName();
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                System.out.println("User not found for email: " + email);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại!");
                return ResponseEntity.notFound().build();
            }

            System.out.println("Found user: " + userOptional.get().getFullName());
            userService.changePassword(userOptional.get().getId(), passwordDto);
            System.out.println("Password changed successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đổi mật khẩu thành công!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error changing password: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
