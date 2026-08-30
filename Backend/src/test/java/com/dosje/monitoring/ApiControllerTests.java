package com.dosje.monitoring;

import com.dosje.monitoring.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class ApiControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAuthLogin_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.role").value("ROLE_DOSJE_OFFICIAL"));
    }

    @Test
    void testGetAllProjects() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void testGetAllInspections() throws Exception {
        mockMvc.perform(get("/api/inspections"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void testRandomAssignInspection() throws Exception {
        RandomAssignRequest request = new RandomAssignRequest("PRJ-001", "30 May 2026", "11:00 AM", "High");

        mockMvc.perform(post("/api/inspections/random-assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.allocationMethod").value("Rule-Based Randomized Allocation"))
                .andExpect(jsonPath("$.data.inspectorName").isNotEmpty());
    }

    @Test
    void testGPSVerification() throws Exception {
        GPSVerificationRequest request = new GPSVerificationRequest(18.5204, 73.8567, 7.5, "28 May 2026, 11:30 AM");

        mockMvc.perform(post("/api/inspections/INS-2026-1024/gps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.gpsVerified").value(true));
    }

    @Test
    void testAttendanceVerificationWithAnomaly() throws Exception {
        // Drop attendance to 18/50 = 36% (deviation > 20%)
        AttendanceVerificationRequest request = new AttendanceVerificationRequest(50, 18, 32, 80);

        mockMvc.perform(post("/api/inspections/INS-2026-1024/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.anomalyDetected").value(true));
    }

    @Test
    void testAddEvidence() throws Exception {
        EvidenceRequest request = new EvidenceRequest(
                "https://images.unsplash.com/photo-1577495508048-b635879837f1",
                "Gate_Photo.jpg",
                "IMAGE",
                18.5204,
                73.8567,
                5.0,
                "28 May 2026, 11:45 AM",
                "Gate Geo-tagged photo"
        );

        mockMvc.perform(post("/api/inspections/INS-2026-1024/evidence")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.latitude").value(18.5204));
    }

    @Test
    void testSubmitInspection() throws Exception {
        // Ensure GPS verified first
        GPSVerificationRequest gps = new GPSVerificationRequest(18.5204, 73.8567, 6.0, "28 May 2026, 11:30 AM");
        mockMvc.perform(post("/api/inspections/INS-2026-1024/gps")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(gps)));

        InspectionSubmitRequest submitRequest = new InspectionSubmitRequest();
        submitRequest.setInfrastructureCheck("PASS");
        submitRequest.setStaffCheck("PASS");
        submitRequest.setBeneficiaryCheck("PASS");
        submitRequest.setRecordsCheck("PASS");
        submitRequest.setServiceCheck("PASS");
        submitRequest.setSafetyCheck("PASS");
        submitRequest.setSchemeCheck("PASS");
        submitRequest.setObservations("Building is in good condition, records verified.");
        submitRequest.setFinalRemarks("Completed successfully.");
        submitRequest.setOverallStatus("Compliant");
        submitRequest.setComplianceScore(92);

        mockMvc.perform(post("/api/inspections/INS-2026-1024/submit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submitRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("Completed"));
    }

    @Test
    void testDashboardAnalytics() throws Exception {
        mockMvc.perform(get("/api/analytics/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalProjects").isNumber());
    }

    @Test
    void testRiskAnalytics() throws Exception {
        mockMvc.perform(get("/api/analytics/risk"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.overallRiskScore").isNumber());
    }

    @Test
    void testGetAlerts() throws Exception {
        mockMvc.perform(get("/api/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void testGetCCTV() throws Exception {
        mockMvc.perform(get("/api/cctv"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }
}
