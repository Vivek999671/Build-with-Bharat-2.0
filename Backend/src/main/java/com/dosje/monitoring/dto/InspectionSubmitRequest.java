package com.dosje.monitoring.dto;

public class InspectionSubmitRequest {

    private String infrastructureCheck = "PASS";
    private String staffCheck = "PASS";
    private String beneficiaryCheck = "PASS";
    private String recordsCheck = "PASS";
    private String serviceCheck = "PASS";
    private String safetyCheck = "PASS";
    private String schemeCheck = "PASS";

    private String observations;
    private String finalRemarks;
    private String overallStatus; // Compliant, Partially Compliant, Non-Compliant
    private String riskLevel; // Low, Medium, High, Critical
    private Integer complianceScore; // 0 - 100

    public InspectionSubmitRequest() {
    }

    public String getInfrastructureCheck() {
        return infrastructureCheck;
    }

    public void setInfrastructureCheck(String infrastructureCheck) {
        this.infrastructureCheck = infrastructureCheck;
    }

    public String getStaffCheck() {
        return staffCheck;
    }

    public void setStaffCheck(String staffCheck) {
        this.staffCheck = staffCheck;
    }

    public String getBeneficiaryCheck() {
        return beneficiaryCheck;
    }

    public void setBeneficiaryCheck(String beneficiaryCheck) {
        this.beneficiaryCheck = beneficiaryCheck;
    }

    public String getRecordsCheck() {
        return recordsCheck;
    }

    public void setRecordsCheck(String recordsCheck) {
        this.recordsCheck = recordsCheck;
    }

    public String getServiceCheck() {
        return serviceCheck;
    }

    public void setServiceCheck(String serviceCheck) {
        this.serviceCheck = serviceCheck;
    }

    public String getSafetyCheck() {
        return safetyCheck;
    }

    public void setSafetyCheck(String safetyCheck) {
        this.safetyCheck = safetyCheck;
    }

    public String getSchemeCheck() {
        return schemeCheck;
    }

    public void setSchemeCheck(String schemeCheck) {
        this.schemeCheck = schemeCheck;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }

    public String getFinalRemarks() {
        return finalRemarks;
    }

    public void setFinalRemarks(String finalRemarks) {
        this.finalRemarks = finalRemarks;
    }

    public String getOverallStatus() {
        return overallStatus;
    }

    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Integer getComplianceScore() {
        return complianceScore;
    }

    public void setComplianceScore(Integer complianceScore) {
        this.complianceScore = complianceScore;
    }
}
