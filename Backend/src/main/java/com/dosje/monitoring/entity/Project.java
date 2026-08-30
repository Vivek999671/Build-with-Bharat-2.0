package com.dosje.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    private String id; // e.g. PRJ-001

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String organization;

    private String scheme;
    private String location;
    private String state;
    private String district;

    private Double latitude;
    private Double longitude;

    private String status = "Active"; // Active, Pending Review, High Risk
    private Integer riskScore = 20; // 0 - 100
    private String riskLevel = "Low"; // Low, Medium, High, Critical
    private Integer complianceScore = 85; // 0 - 100
    private Integer attendanceRate = 90; // 0 - 100

    private Integer totalStaff = 50;
    private Integer presentStaff = 45;
    private Integer beneficiaries = 150;

    private String lastInspection;
    private String nextInspection;

    private String cctvStatus = "ONLINE"; // ONLINE, OFFLINE
    private String cctvCameraId;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Project() {
    }

    public Project(String id, String name, String organization, String scheme, String location,
                   String state, String district, Double latitude, Double longitude, String status,
                   Integer riskScore, String riskLevel, Integer complianceScore, Integer attendanceRate,
                   Integer totalStaff, Integer presentStaff, Integer beneficiaries,
                   String lastInspection, String nextInspection, String cctvStatus, String cctvCameraId) {
        this.id = id;
        this.name = name;
        this.organization = organization;
        this.scheme = scheme;
        this.location = location;
        this.state = state;
        this.district = district;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.complianceScore = complianceScore;
        this.attendanceRate = attendanceRate;
        this.totalStaff = totalStaff;
        this.presentStaff = presentStaff;
        this.beneficiaries = beneficiaries;
        this.lastInspection = lastInspection;
        this.nextInspection = nextInspection;
        this.cctvStatus = cctvStatus;
        this.cctvCameraId = cctvCameraId;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getScheme() {
        return scheme;
    }

    public void setScheme(String scheme) {
        this.scheme = scheme;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Integer getComplianceScore() {
        return complianceScore;
    }

    public void setComplianceScore(Integer complianceScore) {
        this.complianceScore = complianceScore;
    }

    public Integer getAttendanceRate() {
        return attendanceRate;
    }

    public void setAttendanceRate(Integer attendanceRate) {
        this.attendanceRate = attendanceRate;
    }

    public Integer getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(Integer totalStaff) {
        this.totalStaff = totalStaff;
    }

    public Integer getPresentStaff() {
        return presentStaff;
    }

    public void setPresentStaff(Integer presentStaff) {
        this.presentStaff = presentStaff;
    }

    public Integer getBeneficiaries() {
        return beneficiaries;
    }

    public void setBeneficiaries(Integer beneficiaries) {
        this.beneficiaries = beneficiaries;
    }

    public String getLastInspection() {
        return lastInspection;
    }

    public void setLastInspection(String lastInspection) {
        this.lastInspection = lastInspection;
    }

    public String getNextInspection() {
        return nextInspection;
    }

    public void setNextInspection(String nextInspection) {
        this.nextInspection = nextInspection;
    }

    public String getCctvStatus() {
        return cctvStatus;
    }

    public void setCctvStatus(String cctvStatus) {
        this.cctvStatus = cctvStatus;
    }

    public String getCctvCameraId() {
        return cctvCameraId;
    }

    public void setCctvCameraId(String cctvCameraId) {
        this.cctvCameraId = cctvCameraId;
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
