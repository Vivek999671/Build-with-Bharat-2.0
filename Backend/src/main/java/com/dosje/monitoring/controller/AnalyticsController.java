package com.dosje.monitoring.controller;

import com.dosje.monitoring.dto.ApiResponse;
import com.dosje.monitoring.dto.DashboardStatsDTO;
import com.dosje.monitoring.dto.RiskAnalyticsDTO;
import com.dosje.monitoring.service.AnalyticsService;
import com.dosje.monitoring.service.RiskAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private RiskAnalysisService riskAnalysisService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardAnalytics() {
        DashboardStatsDTO stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/risk")
    public ResponseEntity<ApiResponse<RiskAnalyticsDTO>> getRiskAnalytics() {
        RiskAnalyticsDTO risk = riskAnalysisService.getRiskAnalyticsOverview();
        return ResponseEntity.ok(ApiResponse.ok(risk));
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAttendanceAnalytics() {
        List<Map<String, Object>> attendanceTrends = List.of(
                Map.of("project", "Tribal Welfare Centre", "rate", 92, "status", "NORMAL"),
                Map.of("project", "Women Support Centre", "rate", 78, "status", "NORMAL"),
                Map.of("project", "Child Care Institute", "rate", 46, "status", "ANOMALY"),
                Map.of("project", "Divyang Skill Centre", "rate", 88, "status", "NORMAL")
        );
        return ResponseEntity.ok(ApiResponse.ok(attendanceTrends));
    }
}
