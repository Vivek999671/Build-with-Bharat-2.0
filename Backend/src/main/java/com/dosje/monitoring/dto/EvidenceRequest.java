package com.dosje.monitoring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EvidenceRequest {

    @NotBlank(message = "File URL or Base64 is required")
    private String fileUrl;

    private String fileName;
    private String mediaType = "IMAGE"; // IMAGE, VIDEO

    @NotNull(message = "GPS Latitude is required for geo-tagging")
    private Double latitude;

    @NotNull(message = "GPS Longitude is required for geo-tagging")
    private Double longitude;

    private Double accuracyMeters;
    private String capturedTimestamp;
    private String caption;

    public EvidenceRequest() {
    }

    public EvidenceRequest(String fileUrl, String fileName, String mediaType, Double latitude,
                           Double longitude, Double accuracyMeters, String capturedTimestamp, String caption) {
        this.fileUrl = fileUrl;
        this.fileName = fileName;
        this.mediaType = mediaType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracyMeters = accuracyMeters;
        this.capturedTimestamp = capturedTimestamp;
        this.caption = caption;
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
}
