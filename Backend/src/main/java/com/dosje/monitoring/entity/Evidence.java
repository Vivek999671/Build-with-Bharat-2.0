package com.dosje.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidences")
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String inspectionId;

    private String projectId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    private String fileName;
    private String mediaType; // IMAGE, VIDEO

    private Double latitude;
    private Double longitude;
    private Double accuracyMeters;

    private String capturedTimestamp;
    @Column(columnDefinition = "TEXT")
    private String caption;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Evidence() {
    }

    public Evidence(String inspectionId, String projectId, String fileUrl, String fileName,
                    String mediaType, Double latitude, Double longitude, Double accuracyMeters,
                    String capturedTimestamp, String caption) {
        this.inspectionId = inspectionId;
        this.projectId = projectId;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.mediaType = mediaType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracyMeters = accuracyMeters;
        this.capturedTimestamp = capturedTimestamp;
        this.caption = caption;
        this.createdAt = LocalDateTime.now();
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

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
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

    public Double getAccuracyMeters() {
        return accuracyMeters;
    }

    public void setAccuracyMeters(Double accuracyMeters) {
        this.accuracyMeters = accuracyMeters;
    }

    public String getCapturedTimestamp() {
        return capturedTimestamp;
    }

    public void setCapturedTimestamp(String capturedTimestamp) {
        this.capturedTimestamp = capturedTimestamp;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
