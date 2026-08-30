package com.dosje.monitoring.controller;

import com.dosje.monitoring.dto.ApiResponse;
import com.dosje.monitoring.dto.LoginRequest;
import com.dosje.monitoring.dto.LoginResponse;
import com.dosje.monitoring.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.authenticateUser(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}
