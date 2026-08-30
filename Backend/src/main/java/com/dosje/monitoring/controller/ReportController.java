package com.dosje.monitoring.controller;

import com.dosje.monitoring.dto.ApiResponse;
import com.dosje.monitoring.entity.Report;
import com.dosje.monitoring.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Report>>> getAllReports() {
        List<Report> list = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Report>> generateReport(
            @RequestParam(required = false) String scheme,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false, defaultValue = "PDF") String format,
            @RequestParam(required = false, defaultValue = "DoSJE Administrator") String generatedBy) {
        Report report = reportService.generateReport(scheme, state, district, format, generatedBy);
        return ResponseEntity.ok(ApiResponse.ok("Report generated successfully", report));
    }
}
