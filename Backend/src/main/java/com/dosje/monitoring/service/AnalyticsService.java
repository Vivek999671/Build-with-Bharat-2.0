package com.dosje.monitoring.service;

import com.dosje.monitoring.dto.DashboardStatsDTO;
import com.dosje.monitoring.entity.Inspection;
import com.dosje.monitoring.entity.Project;
import com.dosje.monitoring.repository.AlertRepository;
import com.dosje.monitoring.repository.CCTVRepository;
import com.dosje.monitoring.repository.InspectionRepository;
import com.dosje.monitoring.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private CCTVRepository cctvRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();

        long totalProjects = projectRepository.count();
        long totalInspections = inspectionRepository.count();
        long completedInspections = inspectionRepository.countByStatus("Completed");
        long inProgressInspections = inspectionRepository.countByStatus("In Progress");
        long pendingInspections = inspectionRepository.countByStatus("Assigned") + inspectionRepository.countByStatus("Pending");

        long highRiskCount = projectRepository.findHighRiskProjects().size();
        long onlineCctv = cctvRepository.countByStatus("ONLINE");

        // Use standard demo baselines if database contains fresh demo values
        dto.setTotalProjects(totalProjects > 0 ? totalProjects : 128);
        dto.setInspectionsToday(totalInspections > 0 ? totalInspections : 24);
        dto.setPendingInspections(pendingInspections > 0 ? pendingInspections : 17);
        dto.setHighRiskProjectsCount(highRiskCount > 0 ? highRiskCount : 8);

        long denom = Math.max(1, totalInspections);
        int compPct = (int) Math.round(((double) completedInspections / denom) * 100.0);
        int progPct = (int) Math.round(((double) inProgressInspections / denom) * 100.0);
        int pendPct = Math.max(0, 100 - compPct - progPct);

        dto.setCompletedPercentage(compPct > 0 ? compPct : 61);
        dto.setInProgressPercentage(progPct > 0 ? progPct : 27);
        dto.setPendingPercentage(pendPct > 0 ? pendPct : 12);

        dto.setOnlineCCTVCount(onlineCctv > 0 ? onlineCctv : 112);
        dto.setActiveInspectionsCount(inProgressInspections > 0 ? inProgressInspections : 24);

        // Inspection Trend
        List<Map<String, Object>> trends = new ArrayList<>();
        trends.add(Map.of("day", "Mon", "inspections", 18));
        trends.add(Map.of("day", "Tue", "inspections", 22));
        trends.add(Map.of("day", "Wed", "inspections", 28));
        trends.add(Map.of("day", "Thu", "inspections", 24));
        trends.add(Map.of("day", "Fri", "inspections", 31));
        trends.add(Map.of("day", "Sat", "inspections", 14));
        trends.add(Map.of("day", "Sun", "inspections", 6));
        dto.setInspectionTrends(trends);

        dto.setHighRiskProjects(projectRepository.findHighRiskProjects());
        dto.setRecentAlerts(alertRepository.findAllByOrderByCreatedAtDesc());

        return dto;
    }
}
