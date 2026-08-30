package com.dosje.monitoring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    private String id; // e.g. ALT-901

    @Column(nullable = false)
    private String type; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String title;

    private String projectName;
    private String projectId;
    private Integer riskScore;

    @Column(length = 1000)
    private String description;

    private String timestamp;
    private Boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Alert() {
    }

    public Alert(String id, String type, String title, String projectName, String projectId,
                 Integer riskScore, String description, String timestamp, Boolean isRead) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.projectName = projectName;
        this.projectId = projectId;
        this.riskScore = riskScore;
        this.description = description;
        this.timestamp = timestamp;
        this.isRead = isRead;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
