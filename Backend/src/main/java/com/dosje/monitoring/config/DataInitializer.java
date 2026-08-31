package com.dosje.monitoring.config;

import com.dosje.monitoring.entity.*;
import com.dosje.monitoring.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private CCTVRepository cctvRepository;

    @Autowired
    private EvidenceRepository evidenceRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedProjects();
        seedInspections();
        seedAlerts();
        seedCCTV();
        seedEvidences();
        seedReports();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("admin123");

            User official = new User(
                    "OFF-001",
                    "admin",
                    encodedPassword,
                    "Dr. Rajesh Verma",
                    "admin@dosje.gov.in",
                    "+91 98765 43210",
                    Role.ROLE_DOSJE_OFFICIAL,
                    "Department of Social Justice and Empowerment",
                    "Joint Secretary / Monitoring Director",
                    "Maharashtra",
                    "New Delhi / Central",
                    "Central Monitoring Cell, Shastri Bhawan",
                    28.6139,
                    77.2090
            );

            User inspector = new User(
                    "INS-OFF-01",
                    "rahul.inspector",
                    encodedPassword,
                    "Rahul Sharma",
                    "rahul.pmu@dosje.gov.in",
                    "+91 91234 56789",
                    Role.ROLE_PMU_INSPECTOR,
                    "DoSJE PMU Field Division",
                    "PMU Field Officer (Rank 2)",
                    "Maharashtra",
                    "Pune",
                    "Shivajinagar, Pune",
                    18.5314,
                    73.8446
            );
            inspector.setActiveTasksCount(2);
            inspector.setPendingToday(1);
            inspector.setCompletedToday(1);

            User inspector2 = new User(
                    "INS-OFF-02",
                    "pooja.inspector",
                    encodedPassword,
                    "Pooja Verma",
                    "pooja.pmu@dosje.gov.in",
                    "+91 92345 67890",
                    Role.ROLE_PMU_INSPECTOR,
                    "DoSJE PMU Field Division",
                    "Senior Inspection Officer",
                    "Maharashtra",
                    "Pune",
                    "Kothrud, Pune",
                    18.5074,
                    73.8077
            );
            inspector2.setActiveTasksCount(4);
            inspector2.setPendingToday(0);
            inspector2.setCompletedToday(2);

            User inspector3 = new User(
                    "INS-OFF-03",
                    "amit.inspector",
                    encodedPassword,
                    "Amit Deshmukh",
                    "amit.pmu@dosje.gov.in",
                    "+91 93456 78901",
                    Role.ROLE_PMU_INSPECTOR,
                    "DoSJE PMU Field Division",
                    "District Monitoring Officer",
                    "Maharashtra",
                    "Pune",
                    "Hadapsar, Pune",
                    18.5089,
                    73.9260
            );
            inspector3.setActiveTasksCount(1);
            inspector3.setPendingToday(1);
            inspector3.setCompletedToday(0);

            User staff = new User(
                    "STAFF-001",
                    "staff.tribal",
                    encodedPassword,
                    "Anil Kamble",
                    "staff.tribal@ngo.org",
                    "+91 94567 89012",
                    Role.ROLE_PROJECT_STAFF,
                    "Sahyadri Development Trust",
                    "Project In-Charge / Superintendent",
                    "Maharashtra",
                    "Pune",
                    "Tribal Welfare Centre, Pune",
                    18.5204,
                    73.8567
            );

            userRepository.saveAll(List.of(official, inspector, inspector2, inspector3, staff));
        }
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            Project p1 = new Project(
                    "PRJ-001",
                    "Tribal Welfare Centre",
                    "Sahyadri Development Trust",
                    "Scheme A - PM-JANMAN Tribal Upliftment",
                    "Pune, Maharashtra",
                    "Maharashtra",
                    "Pune",
                    18.5204,
                    73.8567,
                    "Active",
                    24,
                    "Low",
                    88,
                    92,
                    50,
                    46,
                    180,
                    "28 May 2026",
                    "15 June 2026",
                    "ONLINE",
                    "CAM-01"
            );

            Project p2 = new Project(
                    "PRJ-002",
                    "Women Support Centre",
                    "Mahila Utkarsh Sanstha",
                    "Scheme B - Samarthya Women Shelter",
                    "Nagpur, Maharashtra",
                    "Maharashtra",
                    "Nagpur",
                    21.1458,
                    79.0882,
                    "Active",
                    64,
                    "Medium",
                    72,
                    78,
                    30,
                    21,
                    120,
                    "12 May 2026",
                    "02 June 2026",
                    "ONLINE",
                    "CAM-02"
            );

            Project p3 = new Project(
                    "PRJ-003",
                    "Child Care & Rehabilitation Institute",
                    "Bal Kalyan Parishad",
                    "Scheme C - Vatsalya Child Protection",
                    "Thane, Maharashtra",
                    "Maharashtra",
                    "Thane",
                    19.2183,
                    72.9781,
                    "Pending Review",
                    82,
                    "Critical",
                    49,
                    46,
                    40,
                    18,
                    95,
                    "05 April 2026",
                    "Overdue (3 days)",
                    "OFFLINE",
                    "CAM-03"
            );

            Project p4 = new Project(
                    "PRJ-004",
                    "Divyang Skill Development Centre",
                    "Samarthya Handicapped Welfare",
                    "Scheme D - Divyangjan Skill Academy",
                    "Nashik, Maharashtra",
                    "Maharashtra",
                    "Nashik",
                    19.9975,
                    73.7898,
                    "Active",
                    35,
                    "Low",
                    91,
                    88,
                    25,
                    23,
                    140,
                    "20 May 2026",
                    "25 June 2026",
                    "ONLINE",
                    "CAM-04"
            );

            projectRepository.saveAll(List.of(p1, p2, p3, p4));
        }
    }

    private void seedInspections() {
        if (inspectionRepository.count() == 0) {
            Inspection ins1 = new Inspection(
                    "INS-2026-1024",
                    "PRJ-001",
                    "Tribal Welfare Centre",
                    "Sahyadri Development Trust",
                    "INS-OFF-01",
                    "Rahul Sharma",
                    "PMU Field Officer (Rank 2)",
                    "28 May 2026",
                    "11:30 AM",
                    "Assigned",
                    "Pune, Maharashtra",
                    18.5204,
                    73.8567,
                    "14.2 km",
                    "Low",
                    92,
                    88,
                    "Normal",
                    "Rule-Based Randomized Allocation",
                    "Inspector selected based on geographic proximity, workload balancing and randomized allocation pool."
            );

            Inspection ins2 = new Inspection(
                    "INS-2026-1025",
                    "PRJ-003",
                    "Child Care & Rehabilitation Institute",
                    "Bal Kalyan Parishad",
                    "INS-OFF-01",
                    "Rahul Sharma",
                    "PMU Field Officer (Rank 2)",
                    "29 May 2026",
                    "02:00 PM",
                    "Flagged",
                    "Thane, Maharashtra",
                    19.2183,
                    72.9781,
                    "28.5 km",
                    "Critical",
                    46,
                    49,
                    "High",
                    "Automated Risk-Triggered",
                    "Triggered automatically due to attendance drop > 50% and overdue inspection alert."
            );

            Inspection ins3 = new Inspection(
                    "INS-2026-1022",
                    "PRJ-002",
                    "Women Support Centre",
                    "Mahila Utkarsh Sanstha",
                    "INS-OFF-02",
                    "Pooja Verma",
                    "Senior Inspection Officer",
                    "25 May 2026",
                    "10:00 AM",
                    "Completed",
                    "Nagpur, Maharashtra",
                    21.1458,
                    79.0882,
                    "5.1 km",
                    "Medium",
                    78,
                    72,
                    "Normal",
                    "Manual Allocation",
                    "Manual quarterly review allocation."
            );
            ins3.setGpsVerified(true);
            ins3.setCapturedLatitude(21.1458);
            ins3.setCapturedLongitude(79.0882);
            ins3.setGpsAccuracyMeters(6.5);
            ins3.setGpsTimestamp("25 May 2026, 10:05 AM");
            ins3.setObservations("Hostel facilities in clean condition. Two fire extinguishers expired; replacement recommended.");
            ins3.setFinalRemarks("Overall satisfactory compliance.");
            ins3.setOverallStatus("Compliant");

            inspectionRepository.saveAll(List.of(ins1, ins2, ins3));
        }
    }

    private void seedAlerts() {
        if (alertRepository.count() == 0) {
            Alert a1 = new Alert(
                    "ALT-901",
                    "CRITICAL",
                    "Attendance Anomaly Detected",
                    "Child Care & Rehabilitation Institute",
                    "PRJ-003",
                    82,
                    "Reported staff attendance dropped by 54% compared to baseline records.",
                    "10 mins ago",
                    false
            );

            Alert a2 = new Alert(
                    "ALT-902",
                    "HIGH",
                    "Inspection Overdue",
                    "Women Support Centre",
                    "PRJ-002",
                    64,
                    "Quarterly compliance review is overdue by 3 days.",
                    "2 hours ago",
                    false
            );

            Alert a3 = new Alert(
                    "ALT-903",
                    "MEDIUM",
                    "CCTV Camera Offline",
                    "Divyang Skill Development Centre",
                    "PRJ-004",
                    35,
                    "CAM-03 video feed stopped transmitting live stream for > 4 hours.",
                    "5 hours ago",
                    true
            );

            alertRepository.saveAll(List.of(a1, a2, a3));
        }
    }

    private void seedCCTV() {
        if (cctvRepository.count() == 0) {
            CCTV c1 = new CCTV("CAM-01", "Camera 01 - Main Gate", "PRJ-001", "Tribal Welfare Centre", "Pune, Maharashtra", "ONLINE", "https://demo.dosje.gov.in/cctv/stream/CAM-01.m3u8", "2 mins ago", "192.168.1.101");
            CCTV c2 = new CCTV("CAM-02", "Camera 02 - Admin Block", "PRJ-002", "Women Support Centre", "Nagpur, Maharashtra", "ONLINE", "https://demo.dosje.gov.in/cctv/stream/CAM-02.m3u8", "Just now", "192.168.1.102");
            CCTV c3 = new CCTV("CAM-03", "Camera 03 - Activity Wing", "PRJ-003", "Child Care & Rehabilitation Institute", "Thane, Maharashtra", "OFFLINE", null, "4 hours ago", "192.168.1.103");
            CCTV c4 = new CCTV("CAM-04", "Camera 04 - Workshop Ground", "PRJ-004", "Divyang Skill Development Centre", "Nashik, Maharashtra", "ONLINE", "https://demo.dosje.gov.in/cctv/stream/CAM-04.m3u8", "1 min ago", "192.168.1.104");

            cctvRepository.saveAll(List.of(c1, c2, c3, c4));
        }
    }

    private void seedEvidences() {
        if (evidenceRepository.count() == 0) {
            Evidence e1 = new Evidence(
                    "INS-2026-1022",
                    "PRJ-002",
                    "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400",
                    "Entrance_Gate_GeoTag.jpg",
                    "IMAGE",
                    21.1458,
                    79.0882,
                    5.2,
                    "25 May 2026, 10:15 AM",
                    "Main Facility Infrastructure Verification"
            );

            Evidence e2 = new Evidence(
                    "INS-2026-1022",
                    "PRJ-002",
                    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400",
                    "Attendance_Register_GeoTag.jpg",
                    "IMAGE",
                    21.1458,
                    79.0882,
                    4.8,
                    "25 May 2026, 10:30 AM",
                    "Physical Register vs Biometric Log Audit"
            );

            evidenceRepository.saveAll(List.of(e1, e2));
        }
    }

    private void seedReports() {
        if (reportRepository.count() == 0) {
            Report r1 = new Report(
                    "REP-2026-001",
                    "Maharashtra State Q1 Comprehensive Inspection Audit",
                    "COMPLIANCE",
                    "Scheme A & B Combined",
                    "Maharashtra",
                    "All Districts",
                    null,
                    "Statewide Overview",
                    128,
                    84,
                    32,
                    12,
                    87.5,
                    "Dr. Rajesh Verma",
                    "PDF",
                    "/api/reports/download/REP-2026-001.pdf"
            );
            reportRepository.save(r1);
        }
    }
}
