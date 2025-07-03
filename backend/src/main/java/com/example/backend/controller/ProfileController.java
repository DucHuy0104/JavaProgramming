package com.example.backend.controller;

import com.example.backend.entity.Profile;
import com.example.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable Long id) {
        try {
            Optional<Profile> profile = profileService.getProfileById(id);
            if (profile.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profile không tồn tại!");
                return ResponseEntity.notFound().build();
            }
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", profile.get());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProfile(@RequestBody Profile profile) {
        try {
            Profile createdProfile = profileService.saveProfile(profile);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo profile thành công!");
            response.put("data", createdProfile);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Profile updatedProfile) {
        try {
            Profile profile = profileService.updateProfile(id, updatedProfile);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cập nhật profile thành công!");
            response.put("data", profile);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id) {
        try {
            profileService.deleteProfile(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa profile thành công!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}