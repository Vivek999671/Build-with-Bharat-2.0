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
    public ResponseEntity<ApiResponse<GPSVerificationResponse>> verifyGPS(
            @PathVariable String id,
            @Valid @RequestBody GPSVerificationRequest request) {
        try {
            GPSVerificationResponse response = inspectionService.verifyGPS(id, request);
            return ResponseEntity.ok(ApiResponse.ok(response.getMessage(), response));
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

    @PostMapping(value = "/{id}/evidence/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Evidence>> uploadEvidence(
            @PathVariable String id,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "fileName", required = false) String fileName,
            @RequestParam(value = "mediaType", required = false) String mediaType,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "accuracyMeters", required = false) Double accuracyMeters,
            @RequestParam(value = "capturedTimestamp", required = false) String capturedTimestamp,
            @RequestParam(value = "caption", required = false) String caption) {
        try {
            Evidence evidence = inspectionService.uploadAndSaveEvidence(
                    id, file, fileName, mediaType, latitude, longitude, accuracyMeters, capturedTimestamp, caption
            );
            return ResponseEntity.ok(ApiResponse.ok("Evidence uploaded to Supabase Storage and registered", evidence));
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
