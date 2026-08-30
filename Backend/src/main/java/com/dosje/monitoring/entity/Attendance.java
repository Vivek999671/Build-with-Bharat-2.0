package com.dosje.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendances")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String inspectionId;

    @Column(nullable = false)
    private String projectId;

    private Integer totalStaff;
    private Integer presentStaff;
    private Integer absentStaff;
    private Integer beneficiariesPresent;

    private Integer attendanceRate; // calculated percentage

    private Boolean isVerified = true;
    private Boolean anomalyDetected = false;
    private String anomalyReason;

    private LocalDateTime recordedAt = LocalDateTime.now();

    public Attendance() {
    }

    public Attendance(String inspectionId, String projectId, Integer totalStaff, Integer presentStaff,
                      Integer absentStaff, Integer beneficiariesPresent, Integer attendanceRate,
                      Boolean isVerified, Boolean anomalyDetected, String anomalyReason) {
        this.inspectionId = inspectionId;
        this.projectId = projectId;
        this.totalStaff = totalStaff;
        this.presentStaff = presentStaff;
        this.absentStaff = absentStaff;
        this.beneficiariesPresent = beneficiariesPresent;
        this.attendanceRate = attendanceRate;
        this.isVerified = isVerified;
        this.anomalyDetected = anomalyDetected;
        this.anomalyReason = anomalyReason;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInspectionId() {
        return inspectionId;
    }

    public void setInspectionId(String inspectionId) {
        this.inspectionId = inspectionId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
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

    public Integer getAbsentStaff() {
        return absentStaff;
    }

    public void setAbsentStaff(Integer absentStaff) {
        this.absentStaff = absentStaff;
    }

    public Integer getBeneficiariesPresent() {
        return beneficiariesPresent;
    }

    public void setBeneficiariesPresent(Integer beneficiariesPresent) {
        this.beneficiariesPresent = beneficiariesPresent;
    }

    public Integer getAttendanceRate() {
        return attendanceRate;
    }

    public void setAttendanceRate(Integer attendanceRate) {
        this.attendanceRate = attendanceRate;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getAnomalyDetected() {
        return anomalyDetected;
    }

    public void setAnomalyDetected(Boolean anomalyDetected) {
        this.anomalyDetected = anomalyDetected;
    }

    public String getAnomalyReason() {
        return anomalyReason;
    }

    public void setAnomalyReason(String anomalyReason) {
        this.anomalyReason = anomalyReason;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
