package com.dosje.monitoring.controller;

import com.dosje.monitoring.dto.ApiResponse;
import com.dosje.monitoring.entity.Alert;
import com.dosje.monitoring.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Alert>>> getAllAlerts(
            @RequestParam(required = false, defaultValue = "All") String type) {
        List<Alert> alerts = alertService.getAllAlerts(type);
        return ResponseEntity.ok(ApiResponse.ok(alerts));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Alert>> markAsRead(@PathVariable String id) {
        try {
            Alert alert = alertService.markAsRead(id);
            return ResponseEntity.ok(ApiResponse.ok("Alert marked as read", alert));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Alert>> createAlert(@RequestBody Alert alert) {
        Alert created = alertService.createAlert(alert);
        return ResponseEntity.ok(ApiResponse.ok("Alert created", created));
    }
}
