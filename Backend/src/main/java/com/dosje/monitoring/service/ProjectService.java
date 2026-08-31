package com.dosje.monitoring.service;

import com.dosje.monitoring.entity.Project;
import com.dosje.monitoring.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects(String filter) {
        if (filter == null || filter.equalsIgnoreCase("All") || filter.trim().isEmpty()) {
            return projectRepository.findAll();
        } else if (filter.equalsIgnoreCase("Active")) {
            return projectRepository.findByStatus("Active");
        } else if (filter.equalsIgnoreCase("High Risk")) {
            return projectRepository.findHighRiskProjects();
        } else if (filter.equalsIgnoreCase("Pending") || filter.equalsIgnoreCase("Pending Review")) {
            return projectRepository.findByStatus("Pending Review");
        }
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }

    public Project saveProject(Project project) {
        if (project.getId() == null || project.getId().isEmpty()) {
            long count = projectRepository.count() + 1;
            project.setId(String.format("PRJ-%03d", count));
        }
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    public Project updateProject(String id, Project updated) {
        return projectRepository.findById(id).map(existing -> {
            existing.setName(updated.getName() != null ? updated.getName() : existing.getName());
            existing.setOrganization(updated.getOrganization() != null ? updated.getOrganization() : existing.getOrganization());
            existing.setScheme(updated.getScheme() != null ? updated.getScheme() : existing.getScheme());
            existing.setLocation(updated.getLocation() != null ? updated.getLocation() : existing.getLocation());
            existing.setDistrict(updated.getDistrict() != null ? updated.getDistrict() : existing.getDistrict());
            existing.setState(updated.getState() != null ? updated.getState() : existing.getState());
            if (updated.getLatitude() != null) existing.setLatitude(updated.getLatitude());
            if (updated.getLongitude() != null) existing.setLongitude(updated.getLongitude());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            if (updated.getRiskScore() != null) existing.setRiskScore(updated.getRiskScore());
            if (updated.getRiskLevel() != null) existing.setRiskLevel(updated.getRiskLevel());
            if (updated.getComplianceScore() != null) existing.setComplianceScore(updated.getComplianceScore());
            if (updated.getAttendanceRate() != null) existing.setAttendanceRate(updated.getAttendanceRate());
            if (updated.getTotalStaff() != null) existing.setTotalStaff(updated.getTotalStaff());
            if (updated.getPresentStaff() != null) existing.setPresentStaff(updated.getPresentStaff());
            if (updated.getBeneficiaries() != null) existing.setBeneficiaries(updated.getBeneficiaries());
            if (updated.getLastInspection() != null) existing.setLastInspection(updated.getLastInspection());
            if (updated.getNextInspection() != null) existing.setNextInspection(updated.getNextInspection());
            if (updated.getCctvStatus() != null) existing.setCctvStatus(updated.getCctvStatus());
            existing.setUpdatedAt(LocalDateTime.now());
            return projectRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }
}
