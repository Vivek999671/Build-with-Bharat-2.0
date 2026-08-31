package com.dosje.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    private String id; // e.g. REP-2026-001

    @Column(nullable = false)
    private String title;

    private String reportType; // COMPLIANCE, INSPECTION_SUMMARY, RISK_AUDIT, ATTENDANCE_ANOMALY
    private String scheme;
    private String state;
    private String district;
    private String projectId;
    private String projectName;

    private Integer totalInspections;
    private Integer completedInspections;
    private Integer pendingInspections;
    private Integer flaggedInspections;
    private Double averageComplianceRate;

    private String generatedBy;
    private String fileFormat = "PDF"; // PDF, CSV
    @Column(columnDefinition = "TEXT")
    private String downloadUrl;

    private LocalDateTime generatedAt = LocalDateTime.now();

    public Report() {
    }

    public Report(String id, String title, String reportType, String scheme, String state,
                  String district, String projectId, String projectName, Integer totalInspections,
                  Integer completedInspections, Integer pendingInspections, Integer flaggedInspections,
                  Double averageComplianceRate, String generatedBy, String fileFormat, String downloadUrl) {
        this.id = id;
        this.title = title;
        this.reportType = reportType;
        this.scheme = scheme;
        this.state = state;
        this.district = district;
        this.projectId = projectId;
        this.projectName = projectName;
        this.totalInspections = totalInspections;
        this.completedInspections = completedInspections;
        this.pendingInspections = pendingInspections;
        this.flaggedInspections = flaggedInspections;
        this.averageComplianceRate = averageComplianceRate;
        this.generatedBy = generatedBy;
        this.fileFormat = fileFormat;
        this.downloadUrl = downloadUrl;
        this.generatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
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

    public Integer getTotalInspections() {
        return totalInspections;
    }

    public void setTotalInspections(Integer totalInspections) {
        this.totalInspections = totalInspections;
    }

    public Integer getCompletedInspections() {
        return completedInspections;
    }

    public void setCompletedInspections(Integer completedInspections) {
        this.completedInspections = completedInspections;
    }

    public Integer getPendingInspections() {
        return pendingInspections;
    }

    public void setPendingInspections(Integer pendingInspections) {
        this.pendingInspections = pendingInspections;
    }

    public Integer getFlaggedInspections() {
        return flaggedInspections;
    }

    public void setFlaggedInspections(Integer flaggedInspections) {
        this.flaggedInspections = flaggedInspections;
    }

    public Double getAverageComplianceRate() {
        return averageComplianceRate;
    }

    public void setAverageComplianceRate(Double averageComplianceRate) {
        this.averageComplianceRate = averageComplianceRate;
    }

    public String getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }

    public String getFileFormat() {
        return fileFormat;
    }

    public void setFileFormat(String fileFormat) {
        this.fileFormat = fileFormat;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
