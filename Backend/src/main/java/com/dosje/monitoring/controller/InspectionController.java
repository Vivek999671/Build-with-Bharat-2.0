package com.dosje.monitoring.controller;

import com.dosje.monitoring.dto.*;
import com.dosje.monitoring.entity.Attendance;
import com.dosje.monitoring.entity.Evidence;
import com.dosje.monitoring.entity.Inspection;
import com.dosje.monitoring.service.InspectionService;
import com.dosje.monitoring.service.RandomAssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspections")
@CrossOrigin(origins = "*")
public class InspectionController {

    @Autowired
    private InspectionService inspectionService;

    @Autowired
    private RandomAssignmentService randomAssignmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Inspection>>> getAllInspections(
            @RequestParam(required = false, defaultValue = "All") String status) {
        List<Inspection> list = inspectionService.getAllInspections(status);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Inspection>> getInspectionById(@PathVariable String id) {
        return inspectionService.getInspectionById(id)
                .map(i -> ResponseEntity.ok(ApiResponse.ok(i)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<Inspection>> assignInspection(@Valid @RequestBody AssignInspectionRequest request) {
        try {
            Inspection inspection = inspectionService.assignManual(request);
            return ResponseEntity.ok(ApiResponse.ok("Inspection successfully assigned", inspection));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/random-assign")
    public ResponseEntity<ApiResponse<Inspection>> randomAssignInspection(@Valid @RequestBody RandomAssignRequest request) {
        try {
            Inspection inspection = randomAssignmentService.generateRandomAssignment(
                    request.getProjectId(),
                    request.getScheduledDate(),
                    request.getScheduledTime(),
                    request.getPriority()
            );
            return ResponseEntity.ok(ApiResponse.ok("Inspection randomized assignment generated successfully", inspection));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/{id}/gps")
    public ResponseEntity<ApiResponse<Inspection>> verifyGPS(
            @PathVariable String id,
            @Valid @RequestBody GPSVerificationRequest request) {
        try {
            Inspection updated = inspectionService.verifyGPS(id, request);
            return ResponseEntity.ok(ApiResponse.ok("GPS location verified and geo-tagged successfully", updated));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/{id}/attendance")
    public ResponseEntity<ApiResponse<Attendance>> recordAttendance(
            @PathVariable String id,
            @Valid @RequestBody AttendanceVerificationRequest request) {
        try {
            Attendance attendance = inspectionService.recordAttendance(id, request);
            String message = attendance.getAnomalyDetected()
                    ? "Attendance verified: ANOMALY FLAGGED (> 20% deviation)"
                    : "Attendance verified successfully";
            return ResponseEntity.ok(ApiResponse.ok(message, attendance));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/{id}/evidence")
    public ResponseEntity<ApiResponse<Evidence>> addEvidence(
            @PathVariable String id,
            @Valid @RequestBody EvidenceRequest request) {
        try {
            Evidence evidence = inspectionService.addEvidence(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Geo-tagged digital evidence registered", evidence));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/{id}/evidence")
    public ResponseEntity<ApiResponse<List<Evidence>>> getEvidences(@PathVariable String id) {
        List<Evidence> list = inspectionService.getEvidences(id);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<Inspection>> submitInspection(
            @PathVariable String id,
            @RequestBody InspectionSubmitRequest request) {
        try {
            Inspection submitted = inspectionService.submitInspection(id, request);
            return ResponseEntity.ok(ApiResponse.ok("Inspection completed and submitted to Central Registry", submitted));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}
