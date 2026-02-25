package com.example.stockAnalysis.service;

import com.example.stockAnalysis.DTO.AuthRequest;
import com.example.stockAnalysis.model.User;
import com.example.stockAnalysis.repositery.UserRepository; // ✅ corrected

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // ✅ Sign-Up
    public String signup(AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "❌ User already exists!";
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword()) // ⚠️ plain text for demo (hash later)
                .build();
        userRepository.save(user);
        return "✅ User registered successfully!";
    }

    // ✅ Sign-In
    public String signin(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            return "❌ User not found!";
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return "❌ Invalid password!";
        }

        return "✅ Login successful!";
    }
}
