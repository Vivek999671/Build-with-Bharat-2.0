package com.dosje.monitoring.dto;

import com.dosje.monitoring.entity.Inspection;

public class GPSVerificationResponse {

    private Boolean gpsVerified;
    private Double distanceMeters;
    private Double deviceLatitude;
    private Double deviceLongitude;
    private Double targetLatitude;
    private Double targetLongitude;
    private Double thresholdMeters;
    private Double accuracyMeters;
    private String message;
    private Inspection inspection;

    public GPSVerificationResponse() {
    }

    public GPSVerificationResponse(Boolean gpsVerified, Double distanceMeters, Double deviceLatitude,
                                   Double deviceLongitude, Double targetLatitude, Double targetLongitude,
                                   Double thresholdMeters, Double accuracyMeters, String message,
                                   Inspection inspection) {
        this.gpsVerified = gpsVerified;
        this.distanceMeters = distanceMeters;
        this.deviceLatitude = deviceLatitude;
        this.deviceLongitude = deviceLongitude;
        this.targetLatitude = targetLatitude;
        this.targetLongitude = targetLongitude;
        this.thresholdMeters = thresholdMeters;
        this.accuracyMeters = accuracyMeters;
        this.message = message;
        this.inspection = inspection;
    }

    public Boolean getGpsVerified() {
        return gpsVerified;
    }

    public void setGpsVerified(Boolean gpsVerified) {
        this.gpsVerified = gpsVerified;
    }

    public Double getDistanceMeters() {
        return distanceMeters;
    }

    public void setDistanceMeters(Double distanceMeters) {
        this.distanceMeters = distanceMeters;
    }

    public Double getDeviceLatitude() {
        return deviceLatitude;
    }

    public void setDeviceLatitude(Double deviceLatitude) {
        this.deviceLatitude = deviceLatitude;
    }

    public Double getDeviceLongitude() {
        return deviceLongitude;
    }

    public void setDeviceLongitude(Double deviceLongitude) {
        this.deviceLongitude = deviceLongitude;
    }

    public Double getTargetLatitude() {
        return targetLatitude;
    }

    public void setTargetLatitude(Double targetLatitude) {
        this.targetLatitude = targetLatitude;
    }

    public Double getTargetLongitude() {
        return targetLongitude;
    }

    public void setTargetLongitude(Double targetLongitude) {
        this.targetLongitude = targetLongitude;
    }

    public Double getThresholdMeters() {
        return thresholdMeters;
    }

    public void setThresholdMeters(Double thresholdMeters) {
        this.thresholdMeters = thresholdMeters;
    }

    public Double getAccuracyMeters() {
        return accuracyMeters;
    }

    public void setAccuracyMeters(Double accuracyMeters) {
        this.accuracyMeters = accuracyMeters;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Inspection getInspection() {
        return inspection;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }
}
