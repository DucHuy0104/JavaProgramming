package com.example.backend.service;

import com.example.backend.entity.Profile;
import com.example.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    public Optional<Profile> getProfileById(Long id) {
        return profileRepository.findById(id);
    }

    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public Profile updateProfile(Long id, Profile updatedProfile) {
        Optional<Profile> profileOptional = profileRepository.findById(id);
        if (profileOptional.isEmpty()) {
            throw new RuntimeException("Profile không tồn tại!");
        }
        Profile profile = profileOptional.get();
        profile.setUserId(updatedProfile.getUserId());
        profile.setFullName(updatedProfile.getFullName());
        profile.setAddress(updatedProfile.getAddress());
        profile.setPhoneNumber(updatedProfile.getPhoneNumber());
        profile.setDateOfBirth(updatedProfile.getDateOfBirth());
        return profileRepository.save(profile);
    }

    public void deleteProfile(Long id) {
        if (!profileRepository.existsById(id)) {
            throw new RuntimeException("Profile không tồn tại!");
        }
        profileRepository.deleteById(id);
    }

    public long countProfiles() {
        return profileRepository.count();
    }
}