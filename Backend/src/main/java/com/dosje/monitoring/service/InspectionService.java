package com.dosje.monitoring.service;

import com.dosje.monitoring.dto.*;
import com.dosje.monitoring.entity.*;
import com.dosje.monitoring.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InspectionService {

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EvidenceRepository evidenceRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private RiskAnalysisService riskAnalysisService;

    @Autowired
    private SupabaseStorageService storageService;

    public List<Inspection> getAllInspections(String status) {
        if (status == null || status.equalsIgnoreCase("All") || status.trim().isEmpty()) {
            return inspectionRepository.findAll();
        }
        return inspectionRepository.findByStatus(status);
    }

    public Optional<Inspection> getInspectionById(String id) {
        return inspectionRepository.findById(id);
    }

    public Inspection assignManual(AssignInspectionRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found: " + request.getProjectId()));

        User inspector = userRepository.findByOfficialId(request.getInspectorId())
                .orElseThrow(() -> new RuntimeException("Inspector not found: " + request.getInspectorId()));

        long count = inspectionRepository.count() + 1;
        String id = String.format("INS-2026-%04d", 1020 + count);

        Inspection inspection = new Inspection();
        inspection.setId(id);
        inspection.setProjectId(project.getId());
        inspection.setProjectName(project.getName());
        inspection.setOrganization(project.getOrganization());
        inspection.setInspectorId(inspector.getOfficialId());
        inspection.setInspectorName(inspector.getFullName());
        inspection.setInspectorRole(inspector.getDesignation() != null ? inspector.getDesignation() : "PMU Field Inspector");
        inspection.setScheduledDate(request.getScheduledDate() != null ? request.getScheduledDate() : "28 May 2026");
        inspection.setScheduledTime(request.getScheduledTime() != null ? request.getScheduledTime() : "11:30 AM");
        inspection.setStatus("Assigned");
        inspection.setLocation(project.getLocation());
        inspection.setLatitude(project.getLatitude());
        inspection.setLongitude(project.getLongitude());
        inspection.setDistance("12.5 km");
        inspection.setRiskLevel(project.getRiskLevel());
        inspection.setAttendance(project.getAttendanceRate());
        inspection.setCompliance(project.getComplianceScore());
        inspection.setPriority(request.getPriority() != null ? request.getPriority() : "Normal");
        inspection.setAllocationMethod("Manual Allocation");
        inspection.setAllocationReason("Manual allocation by DoSJE Superintending Official.");

        inspector.setPendingToday(inspector.getPendingToday() + 1);
        inspector.setActiveTasksCount(inspector.getActiveTasksCount() + 1);
        userRepository.save(inspector);

        return inspectionRepository.save(inspection);
    }

    public GPSVerificationResponse verifyGPS(String inspectionId, GPSVerificationRequest request) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found: " + inspectionId));

        Double targetLat = inspection.getLatitude();
        Double targetLng = inspection.getLongitude();

        // If target coordinates are not directly set on inspection, load from associated Project
        if (targetLat == null || targetLng == null) {
            Project project = projectRepository.findById(inspection.getProjectId()).orElse(null);
            if (project != null) {
                targetLat = project.getLatitude();
                targetLng = project.getLongitude();
                inspection.setLatitude(targetLat);
                inspection.setLongitude(targetLng);
            }
        }

        if (targetLat == null || targetLng == null) {
            throw new RuntimeException("Target project has no GPS coordinates configured for geofence verification.");
        }

        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new RuntimeException("Device GPS coordinates (latitude and longitude) are required.");
        }

        // Coordinate range validation
        if (request.getLatitude() < -90.0 || request.getLatitude() > 90.0 ||
            request.getLongitude() < -180.0 || request.getLongitude() > 180.0) {
            throw new RuntimeException("Device coordinates are out of valid geographic range.");
        }

        // Authoritative Server-Side Haversine Calculation
        double distanceMeters = calculateHaversineDistanceMeters(
                request.getLatitude(), request.getLongitude(),
                targetLat, targetLng
        );

        double thresholdMeters = 150.0;
        boolean withinGeofence = distanceMeters <= thresholdMeters;

        // Persist authoritative verification result in PostgreSQL database
        inspection.setGpsVerified(withinGeofence);
        inspection.setCapturedLatitude(request.getLatitude());
        inspection.setCapturedLongitude(request.getLongitude());
        inspection.setGpsAccuracyMeters(request.getAccuracyMeters() != null ? request.getAccuracyMeters() : 8.0);
        inspection.setGpsTimestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now().toString());

        if (distanceMeters >= 1000.0) {
            inspection.setDistance(String.format("%.1f km", distanceMeters / 1000.0));
        } else {
            inspection.setDistance(String.format("%.0f m", distanceMeters));
        }

        if (withinGeofence) {
            inspection.setStatus("In Progress");
        }
        inspection.setUpdatedAt(LocalDateTime.now());

        Inspection savedInspection = inspectionRepository.save(inspection);

        // Required Debug Logging
        System.out.println("=== GPS VERIFICATION ===");
        System.out.println("Inspection ID: " + inspectionId);
        System.out.println("Device: lat=" + request.getLatitude() + ", lng=" + request.getLongitude() + " (accuracy=" + request.getAccuracyMeters() + "m)");
        System.out.println("Target: lat=" + targetLat + ", lng=" + targetLng);
        System.out.printf("Distance: %.2f meters%n", distanceMeters);
        System.out.println("Threshold: " + thresholdMeters + " meters");
        System.out.println("Verified: " + withinGeofence);
        System.out.println("========================");

        String statusMsg = withinGeofence
                ? String.format("GPS verified: Within geofence (%.1fm <= %.0fm)", distanceMeters, thresholdMeters)
                : String.format("GPS verification failed: Outside geofence (%.1fm > %.0fm)", distanceMeters, thresholdMeters);

        return new GPSVerificationResponse(
                withinGeofence,
                Math.round(distanceMeters * 10.0) / 10.0,
                request.getLatitude(),
                request.getLongitude(),
                targetLat,
                targetLng,
                thresholdMeters,
                request.getAccuracyMeters(),
                statusMsg,
                savedInspection
        );
    }

    public double calculateHaversineDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371000.0; // Earth radius in meters
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);
        double c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        return R * c;
    }

    public Attendance recordAttendance(String inspectionId, AttendanceVerificationRequest request) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found: " + inspectionId));

        int total = request.getTotalStaff() != null ? request.getTotalStaff() : 50;
        int present = request.getPresentStaff() != null ? request.getPresentStaff() : 45;
        int absent = request.getAbsentStaff() != null ? request.getAbsentStaff() : (total - present);
        int rate = total > 0 ? (int) Math.round(((double) present / total) * 100.0) : 0;

        // Check against project baseline attendance
        Project project = projectRepository.findById(inspection.getProjectId()).orElse(null);
        int baseline = project != null && project.getAttendanceRate() != null ? project.getAttendanceRate() : 90;

        boolean anomaly = riskAnalysisService.checkAndCreateAttendanceAnomaly(inspection.getProjectId(), rate, baseline);

        Attendance attendance = attendanceRepository.findByInspectionId(inspectionId)
                .orElse(new Attendance());

        attendance.setInspectionId(inspectionId);
        attendance.setProjectId(inspection.getProjectId());
        attendance.setTotalStaff(total);
        attendance.setPresentStaff(present);
        attendance.setAbsentStaff(absent);
        attendance.setBeneficiariesPresent(request.getBeneficiariesPresent() != null ? request.getBeneficiariesPresent() : 150);
        attendance.setAttendanceRate(rate);
        attendance.setIsVerified(true);
        attendance.setAnomalyDetected(anomaly);
        attendance.setAnomalyReason(anomaly ? "Attendance dropped > 20% compared to baseline records." : "Within normal baseline threshold.");

        inspection.setAttendance(rate);
        inspectionRepository.save(inspection);

        return attendanceRepository.save(attendance);
    }

    public Evidence addEvidence(String inspectionId, EvidenceRequest request) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found: " + inspectionId));

        Evidence evidence = new Evidence();
        evidence.setInspectionId(inspectionId);
        evidence.setProjectId(inspection.getProjectId());
        evidence.setFileUrl(request.getFileUrl());
        evidence.setFileName(request.getFileName() != null ? request.getFileName() : "Evidence_" + System.currentTimeMillis() + ".jpg");
        evidence.setMediaType(request.getMediaType() != null ? request.getMediaType() : "IMAGE");
        evidence.setLatitude(request.getLatitude());
        evidence.setLongitude(request.getLongitude());
        evidence.setAccuracyMeters(request.getAccuracyMeters() != null ? request.getAccuracyMeters() : 8.0);
        evidence.setCapturedTimestamp(request.getCapturedTimestamp() != null ? request.getCapturedTimestamp() : LocalDateTime.now().toString());
        evidence.setCaption(request.getCaption() != null ? request.getCaption() : "Geo-Tagged Inspection Evidence");

        return evidenceRepository.save(evidence);
    }

    public Evidence uploadAndSaveEvidence(String inspectionId, org.springframework.web.multipart.MultipartFile file,
                                          String fileName, String mediaType, Double latitude, Double longitude,
                                          Double accuracyMeters, String capturedTimestamp, String caption) throws Exception {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found: " + inspectionId));

        // 1. Securely upload binary file to Supabase Storage bucket 'evidence'
        String storageUrl = storageService.uploadEvidenceFile(file, inspectionId);

        // 2. Persist evidence record and URL in PostgreSQL database
        Evidence evidence = new Evidence();
        evidence.setInspectionId(inspectionId);
        evidence.setProjectId(inspection.getProjectId());
        evidence.setFileUrl(storageUrl);
        evidence.setFileName(fileName != null && !fileName.trim().isEmpty() ? fileName : file.getOriginalFilename());
        evidence.setMediaType(mediaType != null ? mediaType : (file.getContentType() != null && file.getContentType().contains("video") ? "VIDEO" : "IMAGE"));
        evidence.setLatitude(latitude);
        evidence.setLongitude(longitude);
        evidence.setAccuracyMeters(accuracyMeters != null ? accuracyMeters : 8.0);
        evidence.setCapturedTimestamp(capturedTimestamp != null ? capturedTimestamp : LocalDateTime.now().toString());
        evidence.setCaption(caption != null ? caption : "Geo-Tagged Inspection Evidence");

        return evidenceRepository.save(evidence);
    }

    public List<Evidence> getEvidences(String inspectionId) {
        return evidenceRepository.findByInspectionId(inspectionId);
    }

    public Inspection submitInspection(String inspectionId, InspectionSubmitRequest request) {
        Inspection inspection = inspectionRepository.findById(inspectionId)
                .orElseThrow(() -> new RuntimeException("Inspection not found: " + inspectionId));

        if (!Boolean.TRUE.equals(inspection.getGpsVerified())) {
            throw new RuntimeException("GPS verification is mandatory before submitting field inspection.");
        }

        inspection.setInfrastructureCheck(request.getInfrastructureCheck());
        inspection.setStaffCheck(request.getStaffCheck());
        inspection.setBeneficiaryCheck(request.getBeneficiaryCheck());
        inspection.setRecordsCheck(request.getRecordsCheck());
        inspection.setServiceCheck(request.getServiceCheck());
        inspection.setSafetyCheck(request.getSafetyCheck());
        inspection.setSchemeCheck(request.getSchemeCheck());

        inspection.setObservations(request.getObservations());
        inspection.setFinalRemarks(request.getFinalRemarks());
        inspection.setOverallStatus(request.getOverallStatus() != null ? request.getOverallStatus() : "Compliant");

        int compScore = request.getComplianceScore() != null ? request.getComplianceScore() : 88;
        inspection.setCompliance(compScore);

        inspection.setStatus("Completed");
        inspection.setSubmittedAt(LocalDateTime.now());
        inspection.setUpdatedAt(LocalDateTime.now());

        // Update Project record
        projectRepository.findById(inspection.getProjectId()).ifPresent(project -> {
            project.setComplianceScore(compScore);
            project.setAttendanceRate(inspection.getAttendance());
            project.setLastInspection(LocalDateTime.now().toLocalDate().toString());
            project.setNextInspection("15 July 2026");

            // Evaluate risk
            riskAnalysisService.calculateProjectRisk(project, false, "OFFLINE".equalsIgnoreCase(project.getCctvStatus()));
        });

        // Update inspector workload
        userRepository.findByOfficialId(inspection.getInspectorId()).ifPresent(inspector -> {
            if (inspector.getPendingToday() > 0) inspector.setPendingToday(inspector.getPendingToday() - 1);
            if (inspector.getActiveTasksCount() > 0) inspector.setActiveTasksCount(inspector.getActiveTasksCount() - 1);
            inspector.setCompletedToday(inspector.getCompletedToday() + 1);
            userRepository.save(inspector);
        });

        return inspectionRepository.save(inspection);
    }
}
