package com.dosje.monitoring.dto;

import com.dosje.monitoring.entity.Project;
import java.util.List;
import java.util.Map;

public class RiskAnalyticsDTO {
    private double overallRiskScore;
    private String overallRiskLevel;
    private long totalEvaluatedProjects;
    private long criticalRiskCount;
    private long highRiskCount;
    private long mediumRiskCount;
    private long lowRiskCount;

    private List<String> primaryRiskFactors;
    private List<Project> highRiskProjects;
    private List<Map<String, Object>> riskDistribution;
    private List<Map<String, Object>> complianceTrend;

    public RiskAnalyticsDTO() {
    }

    public double getOverallRiskScore() {
        return overallRiskScore;
    }

    public void setOverallRiskScore(double overallRiskScore) {
        this.overallRiskScore = overallRiskScore;
    }

    public String getOverallRiskLevel() {
        return overallRiskLevel;
    }

    public void setOverallRiskLevel(String overallRiskLevel) {
        this.overallRiskLevel = overallRiskLevel;
    }

    public long getTotalEvaluatedProjects() {
        return totalEvaluatedProjects;
    }

    public void setTotalEvaluatedProjects(long totalEvaluatedProjects) {
        this.totalEvaluatedProjects = totalEvaluatedProjects;
    }

    public long getCriticalRiskCount() {
        return criticalRiskCount;
    }

    public void setCriticalRiskCount(long criticalRiskCount) {
        this.criticalRiskCount = criticalRiskCount;
    }

    public long getHighRiskCount() {
        return highRiskCount;
    }

    public void setHighRiskCount(long highRiskCount) {
        this.highRiskCount = highRiskCount;
    }

    public long getMediumRiskCount() {
        return mediumRiskCount;
    }

    public void setMediumRiskCount(long mediumRiskCount) {
        this.mediumRiskCount = mediumRiskCount;
    }

    public long getLowRiskCount() {
        return lowRiskCount;
    }

    public void setLowRiskCount(long lowRiskCount) {
        this.lowRiskCount = lowRiskCount;
    }

    public List<String> getPrimaryRiskFactors() {
        return primaryRiskFactors;
    }

    public void setPrimaryRiskFactors(List<String> primaryRiskFactors) {
        this.primaryRiskFactors = primaryRiskFactors;
    }

    public List<Project> getHighRiskProjects() {
        return highRiskProjects;
    }

    public void setHighRiskProjects(List<Project> highRiskProjects) {
        this.highRiskProjects = highRiskProjects;
    }

    public List<Map<String, Object>> getRiskDistribution() {
        return riskDistribution;
    }

    public void setRiskDistribution(List<Map<String, Object>> riskDistribution) {
        this.riskDistribution = riskDistribution;
    }

    public List<Map<String, Object>> getComplianceTrend() {
        return complianceTrend;
    }

    public void setComplianceTrend(List<Map<String, Object>> complianceTrend) {
        this.complianceTrend = complianceTrend;
    }
}
