package com.example.stockAnalysis.controller;

// AuthController.java

import com.example.stockAnalysis.DTO.AuthRequest;
import com.example.stockAnalysis.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public String signup(@RequestBody AuthRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/signin")
    public String signin(@RequestBody AuthRequest request) {
        return authService.signin(request);
    }
}
