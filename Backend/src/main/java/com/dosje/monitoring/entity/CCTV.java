package com.dosje.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cctv_cameras")
public class CCTV {

    @Id
    private String id; // e.g. CAM-01

    @Column(nullable = false)
    private String name; // e.g. Camera 01 - Main Entrance

    private String projectId;
    private String projectName;
    private String location;

    private String status = "ONLINE"; // ONLINE, OFFLINE
    private String streamUrl; // placeholder / RTSP / HLS stream URL
    private String demoStreamType = "Demo Stream (RTSP/HLS Ready)";

    private String lastConnected;
    private String ipAddress;
    private Integer resolutionFps = 30;

    private LocalDateTime updatedAt = LocalDateTime.now();

    public CCTV() {
    }

    public CCTV(String id, String name, String projectId, String projectName, String location,
                String status, String streamUrl, String lastConnected, String ipAddress) {
        this.id = id;
        this.name = name;
        this.projectId = projectId;
        this.projectName = projectName;
        this.location = location;
        this.status = status;
        this.streamUrl = streamUrl;
        this.lastConnected = lastConnected;
        this.ipAddress = ipAddress;
        this.updatedAt = LocalDateTime.now();
    }

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStreamUrl() {
        return streamUrl;
    }

    public void setStreamUrl(String streamUrl) {
        this.streamUrl = streamUrl;
    }

    public String getDemoStreamType() {
        return demoStreamType;
    }

    public void setDemoStreamType(String demoStreamType) {
        this.demoStreamType = demoStreamType;
    }

    public String getLastConnected() {
        return lastConnected;
    }

    public void setLastConnected(String lastConnected) {
        this.lastConnected = lastConnected;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Integer getResolutionFps() {
        return resolutionFps;
    }

    public void setResolutionFps(Integer resolutionFps) {
        this.resolutionFps = resolutionFps;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
