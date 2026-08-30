package com.dosje.monitoring.service;

import com.dosje.monitoring.dto.RiskAnalyticsDTO;
import com.dosje.monitoring.entity.Alert;
import com.dosje.monitoring.entity.Project;
import com.dosje.monitoring.repository.AlertRepository;
import com.dosje.monitoring.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RiskAnalysisService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AlertRepository alertRepository;

    /**
     * Evaluate Project Risk using Rule-Based Analytics Engine
     */
    public int calculateProjectRisk(Project project, boolean hasAttendanceAnomaly, boolean cctvOffline) {
        int complianceScore = project.getComplianceScore() != null ? project.getComplianceScore() : 75;
        int attendanceRate = project.getAttendanceRate() != null ? project.getAttendanceRate() : 80;

        // Base risk calculated from deficits
        double complianceDeficit = (100.0 - complianceScore) * 0.45;
        double attendanceDeficit = (100.0 - attendanceRate) * 0.35;
        double cctvPenalty = cctvOffline ? 20.0 : 0.0;
        double anomalyPenalty = hasAttendanceAnomaly ? 25.0 : 0.0;

        int totalRisk = (int) Math.min(100, Math.max(0, Math.round(complianceDeficit + attendanceDeficit + cctvPenalty + anomalyPenalty)));

        project.setRiskScore(totalRisk);
        if (totalRisk >= 80) {
            project.setRiskLevel("Critical");
            project.setStatus("Pending Review");
        } else if (totalRisk >= 60) {
            project.setRiskLevel("High");
        } else if (totalRisk >= 35) {
            project.setRiskLevel("Medium");
        } else {
            project.setRiskLevel("Low");
        }

        projectRepository.save(project);
        return totalRisk;
    }

    /**
     * Check for Attendance Anomaly (> 20% variance from baseline)
     */
    public boolean checkAndCreateAttendanceAnomaly(String projectId, int reportedRate, int baselineRate) {
        int diff = Math.abs(baselineRate - reportedRate);
        if (diff >= 20) {
            // Anomaly detected!
            Project project = projectRepository.findById(projectId).orElse(null);
            String projectName = project != null ? project.getName() : "Project " + projectId;

            String alertId = "ALT-" + (900 + alertRepository.count() + 1);
            Alert alert = new Alert(
                    alertId,
                    "CRITICAL",
                    "Attendance Anomaly Detected",
                    projectName,
                    projectId,
                    82,
                    String.format("Reported staff attendance dropped by %d%% compared to baseline records (%d%% vs %d%%).", diff, reportedRate, baselineRate),
                    "Just now",
                    false
            );
            alertRepository.save(alert);
            return true;
        }
        return false;
    }

    /**
     * Aggregate Risk Analytics for Dashboard & Analytics Screen
     */
    public RiskAnalyticsDTO getRiskAnalyticsOverview() {
        List<Project> allProjects = projectRepository.findAll();
        long total = allProjects.size();

        long criticalCount = allProjects.stream().filter(p -> "Critical".equalsIgnoreCase(p.getRiskLevel()) || p.getRiskScore() >= 80).count();
        long highCount = allProjects.stream().filter(p -> "High".equalsIgnoreCase(p.getRiskLevel())).count();
        long mediumCount = allProjects.stream().filter(p -> "Medium".equalsIgnoreCase(p.getRiskLevel())).count();
        long lowCount = allProjects.stream().filter(p -> "Low".equalsIgnoreCase(p.getRiskLevel())).count();

        double avgRisk = allProjects.stream().mapToInt(Project::getRiskScore).average().orElse(35.0);

        RiskAnalyticsDTO dto = new RiskAnalyticsDTO();
        dto.setTotalEvaluatedProjects(total);
        dto.setOverallRiskScore(Math.round(avgRisk * 10.0) / 10.0);
        dto.setOverallRiskLevel(avgRisk >= 60 ? "HIGH RISK" : avgRisk >= 40 ? "MODERATE RISK" : "LOW RISK");
        dto.setCriticalRiskCount(criticalCount);
        dto.setHighRiskCount(highCount);
        dto.setMediumRiskCount(mediumCount);
        dto.setLowRiskCount(lowCount);

        dto.setPrimaryRiskFactors(Arrays.asList(
                "Attendance mismatch / proxy verification anomaly (> 20%)",
                "Inspection frequency overdue (> 3 days past milestone)",
                "Repeated non-compliance in infrastructure/safety checklist",
                "CCTV transmission offline or stream dropped"
        ));

        dto.setHighRiskProjects(projectRepository.findHighRiskProjects());

        // Risk distribution chart data
        List<Map<String, Object>> distribution = new ArrayList<>();
        distribution.add(Map.of("label", "Critical", "count", criticalCount, "color", "#DC2626"));
        distribution.add(Map.of("label", "High", "count", highCount, "color", "#EA580C"));
        distribution.add(Map.of("label", "Medium", "count", mediumCount, "color", "#D97706"));
        distribution.add(Map.of("label", "Low", "count", lowCount, "color", "#16A34A"));
        dto.setRiskDistribution(distribution);

        // Compliance trend
        List<Map<String, Object>> complianceTrend = new ArrayList<>();
        complianceTrend.add(Map.of("month", "Jan", "complianceRate", 82));
        complianceTrend.add(Map.of("month", "Feb", "complianceRate", 85));
        complianceTrend.add(Map.of("month", "Mar", "complianceRate", 79));
        complianceTrend.add(Map.of("month", "Apr", "complianceRate", 88));
        complianceTrend.add(Map.of("month", "May", "complianceRate", 86));
        dto.setComplianceTrend(complianceTrend);

        return dto;
    }
}
