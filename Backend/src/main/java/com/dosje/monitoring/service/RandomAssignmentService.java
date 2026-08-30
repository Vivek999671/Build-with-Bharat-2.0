package com.dosje.monitoring.service;

import com.dosje.monitoring.entity.Inspection;
import com.dosje.monitoring.entity.Project;
import com.dosje.monitoring.entity.Role;
import com.dosje.monitoring.entity.User;
import com.dosje.monitoring.repository.InspectionRepository;
import com.dosje.monitoring.repository.ProjectRepository;
import com.dosje.monitoring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RandomAssignmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private InspectionRepository inspectionRepository;

    private final Random random = new SecureRandom();
    private final DecimalFormat df = new DecimalFormat("#.##");

    /**
     * Rule-Based Randomized Inspector Allocation Engine
     */
    public Inspection generateRandomAssignment(String projectId, String scheduledDate, String scheduledTime, String priority) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        List<User> inspectors = userRepository.findByRole(Role.ROLE_PMU_INSPECTOR);
        if (inspectors.isEmpty()) {
            throw new RuntimeException("No PMU Field Inspectors registered in the system.");
        }

        // Project Coordinates (default to Pune if missing)
        double projectLat = project.getLatitude() != null ? project.getLatitude() : 18.5204;
        double projectLng = project.getLongitude() != null ? project.getLongitude() : 73.8567;

        // Calculate metrics for each inspector
        List<InspectorCandidate> scoredCandidates = new ArrayList<>();

        for (User inspector : inspectors) {
            double inspectorLat = inspector.getCurrentLat() != null ? inspector.getCurrentLat() : 18.5314;
            double inspectorLng = inspector.getCurrentLng() != null ? inspector.getCurrentLng() : 73.8446;

            // 1. Calculate Geographic Distance using Haversine formula (km)
            double distanceKm = calculateHaversineDistance(projectLat, projectLng, inspectorLat, inspectorLng);

            // 2. Workload score (lower workload is better)
            int workload = inspector.getPendingToday() != null ? inspector.getPendingToday() : 1;

            // 3. Conflict of interest check (did this inspector inspect this project before?)
            List<Inspection> previousInspections = inspectionRepository.findByInspectorId(inspector.getOfficialId());
            boolean hasRecentConflict = previousInspections.stream()
                    .anyMatch(ins -> ins.getProjectId().equalsIgnoreCase(projectId));

            // Calculate suitability score (lower score = higher suitability)
            // Weighting: distance (40%), workload (40%), conflict penalty (20%)
            double suitabilityScore = (distanceKm * 0.4) + (workload * 15.0) + (hasRecentConflict ? 50.0 : 0.0);

            scoredCandidates.add(new InspectorCandidate(inspector, distanceKm, workload, hasRecentConflict, suitabilityScore));
        }

        // Sort by suitability
        scoredCandidates.sort(Comparator.comparingDouble(InspectorCandidate::getSuitabilityScore));

        // Pick from top candidates with randomized probability distribution to prevent predictability
        int poolSize = Math.min(3, scoredCandidates.size());
        int selectedIndex = random.nextInt(poolSize);
        InspectorCandidate selected = scoredCandidates.get(selectedIndex);

        User chosenInspector = selected.getInspector();
        double distanceKm = selected.getDistanceKm();

        // Generate unique Inspection ID
        long totalCount = inspectionRepository.count() + 1;
        String inspectionId = String.format("INS-2026-%04d", 1020 + totalCount);

        String reason = String.format(
                "Rule-Based Assignment: %s selected based on geographic proximity (%s km), workload balance (%d active tasks), conflict avoidance, and randomized allocation pool.",
                chosenInspector.getFullName(),
                df.format(distanceKm),
                selected.getWorkload()
        );

        Inspection inspection = new Inspection();
        inspection.setId(inspectionId);
        inspection.setProjectId(project.getId());
        inspection.setProjectName(project.getName());
        inspection.setOrganization(project.getOrganization());
        inspection.setInspectorId(chosenInspector.getOfficialId());
        inspection.setInspectorName(chosenInspector.getFullName());
        inspection.setInspectorRole(chosenInspector.getDesignation() != null ? chosenInspector.getDesignation() : "PMU Field Inspector");
        inspection.setScheduledDate(scheduledDate != null ? scheduledDate : "28 May 2026");
        inspection.setScheduledTime(scheduledTime != null ? scheduledTime : "11:30 AM");
        inspection.setStatus("Assigned");
        inspection.setLocation(project.getLocation());
        inspection.setLatitude(project.getLatitude());
        inspection.setLongitude(project.getLongitude());
        inspection.setDistance(df.format(distanceKm) + " km");
        inspection.setRiskLevel(project.getRiskLevel());
        inspection.setAttendance(project.getAttendanceRate());
        inspection.setCompliance(project.getComplianceScore());
        inspection.setPriority(priority != null ? priority : "Normal");
        inspection.setAllocationMethod("Rule-Based Randomized Allocation");
        inspection.setAllocationReason(reason);

        // Update inspector workload
        chosenInspector.setPendingToday(chosenInspector.getPendingToday() + 1);
        chosenInspector.setActiveTasksCount(chosenInspector.getActiveTasksCount() + 1);
        userRepository.save(chosenInspector);

        return inspectionRepository.save(inspection);
    }

    /**
     * Haversine formula to compute great-circle distance between two GPS coordinates
     */
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of Earth in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static class InspectorCandidate {
        private final User inspector;
        private final double distanceKm;
        private final int workload;
        private final boolean hasRecentConflict;
        private final double suitabilityScore;

        public InspectorCandidate(User inspector, double distanceKm, int workload, boolean hasRecentConflict, double suitabilityScore) {
            this.inspector = inspector;
            this.distanceKm = distanceKm;
            this.workload = workload;
            this.hasRecentConflict = hasRecentConflict;
            this.suitabilityScore = suitabilityScore;
        }

        public User getInspector() {
            return inspector;
        }

        public double getDistanceKm() {
            return distanceKm;
        }

        public int getWorkload() {
            return workload;
        }

        public boolean isHasRecentConflict() {
            return hasRecentConflict;
        }

        public double getSuitabilityScore() {
            return suitabilityScore;
        }
    }
}
