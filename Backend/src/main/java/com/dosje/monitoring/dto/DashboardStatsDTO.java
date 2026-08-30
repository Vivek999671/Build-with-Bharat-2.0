package com.dosje.monitoring.dto;

import com.dosje.monitoring.entity.Alert;
import com.dosje.monitoring.entity.Project;
import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalProjects;
    private long inspectionsToday;
    private long pendingInspections;
    private long highRiskProjectsCount;

    private int completedPercentage;
    private int inProgressPercentage;
    private int pendingPercentage;

    private long onlineCCTVCount;
    private long activeInspectionsCount;

    private List<Map<String, Object>> inspectionTrends;
    private List<Project> highRiskProjects;
    private List<Alert> recentAlerts;

    public DashboardStatsDTO() {
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getInspectionsToday() {
        return inspectionsToday;
    }

    public void setInspectionsToday(long inspectionsToday) {
        this.inspectionsToday = inspectionsToday;
    }

    public long getPendingInspections() {
        return pendingInspections;
    }

    public void setPendingInspections(long pendingInspections) {
        this.pendingInspections = pendingInspections;
    }

    public long getHighRiskProjectsCount() {
        return highRiskProjectsCount;
    }

    public void setHighRiskProjectsCount(long highRiskProjectsCount) {
        this.highRiskProjectsCount = highRiskProjectsCount;
    }

    public int getCompletedPercentage() {
        return completedPercentage;
    }

    public void setCompletedPercentage(int completedPercentage) {
        this.completedPercentage = completedPercentage;
    }

    public int getInProgressPercentage() {
        return inProgressPercentage;
    }

    public void setInProgressPercentage(int inProgressPercentage) {
        this.inProgressPercentage = inProgressPercentage;
    }

    public int getPendingPercentage() {
        return pendingPercentage;
    }

    public void setPendingPercentage(int pendingPercentage) {
        this.pendingPercentage = pendingPercentage;
    }

    public long getOnlineCCTVCount() {
        return onlineCCTVCount;
    }

    public void setOnlineCCTVCount(long onlineCCTVCount) {
        this.onlineCCTVCount = onlineCCTVCount;
    }

    public long getActiveInspectionsCount() {
        return activeInspectionsCount;
    }

    public void setActiveInspectionsCount(long activeInspectionsCount) {
        this.activeInspectionsCount = activeInspectionsCount;
    }

    public List<Map<String, Object>> getInspectionTrends() {
        return inspectionTrends;
    }

    public void setInspectionTrends(List<Map<String, Object>> inspectionTrends) {
        this.inspectionTrends = inspectionTrends;
    }

    public List<Project> getHighRiskProjects() {
        return highRiskProjects;
    }

    public void setHighRiskProjects(List<Project> highRiskProjects) {
        this.highRiskProjects = highRiskProjects;
    }

    public List<Alert> getRecentAlerts() {
        return recentAlerts;
    }

    public void setRecentAlerts(List<Alert> recentAlerts) {
        this.recentAlerts = recentAlerts;
    }
}
