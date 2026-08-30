package com.dosje.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inspections")
public class Inspection {

    @Id
    private String id; // e.g. INS-2026-1024

    @Column(nullable = false)
    private String projectId;

    private String projectName;
    private String organization;

    private String inspectorId;
    private String inspectorName;
    private String inspectorRole;

    private String scheduledDate;
    private String scheduledTime;

    private String status = "Assigned"; // Assigned, In Progress, Completed, Pending, Flagged
    private String location;

    private Double latitude;
    private Double longitude;
    private String distance = "0.0 km";

    private String riskLevel = "Low";
    private Integer attendance = 0;
    private Integer compliance = 0;
    private String priority = "Normal";

    private String allocationMethod = "Manual Allocation";
    @Column(columnDefinition = "TEXT")
    private String allocationReason;

    // GPS Verification
    private Boolean gpsVerified = false;
    private Double capturedLatitude;
    private Double capturedLongitude;
    private Double gpsAccuracyMeters;
    private String gpsTimestamp;

    // Checklist statuses (PASS, FAIL, NEEDS_ATTENTION)
    private String infrastructureCheck = "PASS";
    private String staffCheck = "PASS";
    private String beneficiaryCheck = "PASS";
    private String recordsCheck = "PASS";
    private String serviceCheck = "PASS";
    private String safetyCheck = "PASS";
    private String schemeCheck = "PASS";

    // Observations and Remarks
    @Column(columnDefinition = "TEXT")
    private String observations;

    @Column(columnDefinition = "TEXT")
    private String finalRemarks;

    private String overallStatus; // Compliant, Partially Compliant, Non-Compliant

    private LocalDateTime submittedAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Inspection() {
    }

    public Inspection(String id, String projectId, String projectName, String organization,
                      String inspectorId, String inspectorName, String inspectorRole,
                      String scheduledDate, String scheduledTime, String status,
                      String location, Double latitude, Double longitude, String distance,
                      String riskLevel, Integer attendance, Integer compliance, String priority,
                      String allocationMethod, String allocationReason) {
        this.id = id;
        this.projectId = projectId;
        this.projectName = projectName;
        this.organization = organization;
        this.inspectorId = inspectorId;
        this.inspectorName = inspectorName;
        this.inspectorRole = inspectorRole;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.status = status;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distance = distance;
        this.riskLevel = riskLevel;
        this.attendance = attendance;
        this.compliance = compliance;
        this.priority = priority;
        this.allocationMethod = allocationMethod;
        this.allocationReason = allocationReason;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getInspectorId() {
        return inspectorId;
    }

    public void setInspectorId(String inspectorId) {
        this.inspectorId = inspectorId;
    }

    public String getInspectorName() {
        return inspectorName;
    }

    public void setInspectorName(String inspectorName) {
        this.inspectorName = inspectorName;
    }

    public String getInspectorRole() {
        return inspectorRole;
    }

    public void setInspectorRole(String inspectorRole) {
        this.inspectorRole = inspectorRole;
    }

    public String getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(String scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Integer getAttendance() {
        return attendance;
    }

    public void setAttendance(Integer attendance) {
        this.attendance = attendance;
    }

    public Integer getCompliance() {
        return compliance;
    }

    public void setCompliance(Integer compliance) {
        this.compliance = compliance;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAllocationMethod() {
        return allocationMethod;
    }

    public void setAllocationMethod(String allocationMethod) {
        this.allocationMethod = allocationMethod;
    }

    public String getAllocationReason() {
        return allocationReason;
    }

    public void setAllocationReason(String allocationReason) {
        this.allocationReason = allocationReason;
    }

    public Boolean getGpsVerified() {
        return gpsVerified;
    }

    public void setGpsVerified(Boolean gpsVerified) {
        this.gpsVerified = gpsVerified;
    }

    public Double getCapturedLatitude() {
        return capturedLatitude;
    }

    public void setCapturedLatitude(Double capturedLatitude) {
        this.capturedLatitude = capturedLatitude;
    }

    public Double getCapturedLongitude() {
        return capturedLongitude;
    }

    public void setCapturedLongitude(Double capturedLongitude) {
        this.capturedLongitude = capturedLongitude;
    }

    public Double getGpsAccuracyMeters() {
        return gpsAccuracyMeters;
    }

    public void setGpsAccuracyMeters(Double gpsAccuracyMeters) {
        this.gpsAccuracyMeters = gpsAccuracyMeters;
    }

    public String getGpsTimestamp() {
        return gpsTimestamp;
    }

    public void setGpsTimestamp(String gpsTimestamp) {
        this.gpsTimestamp = gpsTimestamp;
    }

    public String getInfrastructureCheck() {
        return infrastructureCheck;
    }

    public void setInfrastructureCheck(String infrastructureCheck) {
        this.infrastructureCheck = infrastructureCheck;
    }

    public String getStaffCheck() {
        return staffCheck;
    }

    public void setStaffCheck(String staffCheck) {
        this.staffCheck = staffCheck;
    }

    public String getBeneficiaryCheck() {
        return beneficiaryCheck;
    }

    public void setBeneficiaryCheck(String beneficiaryCheck) {
        this.beneficiaryCheck = beneficiaryCheck;
    }

    public String getRecordsCheck() {
        return recordsCheck;
    }

    public void setRecordsCheck(String recordsCheck) {
        this.recordsCheck = recordsCheck;
    }

    public String getServiceCheck() {
        return serviceCheck;
    }

    public void setServiceCheck(String serviceCheck) {
        this.serviceCheck = serviceCheck;
    }

    public String getSafetyCheck() {
        return safetyCheck;
    }

    public void setSafetyCheck(String safetyCheck) {
        this.safetyCheck = safetyCheck;
    }

    public String getSchemeCheck() {
        return schemeCheck;
    }

    public void setSchemeCheck(String schemeCheck) {
        this.schemeCheck = schemeCheck;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public String getFinalRemarks() {
        return finalRemarks;
    }

    public void setFinalRemarks(String finalRemarks) {
        this.finalRemarks = finalRemarks;
    }

    public String getOverallStatus() {
        return overallStatus;
    }

    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
