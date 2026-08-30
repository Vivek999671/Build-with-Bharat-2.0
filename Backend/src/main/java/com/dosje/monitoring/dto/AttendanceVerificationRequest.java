package com.dosje.monitoring.dto;

import jakarta.validation.constraints.NotNull;

public class AttendanceVerificationRequest {

    @NotNull(message = "Total staff count is required")
    private Integer totalStaff;

    @NotNull(message = "Present staff count is required")
    private Integer presentStaff;

    private Integer absentStaff;
    private Integer beneficiariesPresent;

    public AttendanceVerificationRequest() {
    }

    public AttendanceVerificationRequest(Integer totalStaff, Integer presentStaff, Integer absentStaff, Integer beneficiariesPresent) {
        this.totalStaff = totalStaff;
        this.presentStaff = presentStaff;
        this.absentStaff = absentStaff != null ? absentStaff : (totalStaff - presentStaff);
        this.beneficiariesPresent = beneficiariesPresent;
    }

    public Integer getTotalStaff() {
        return totalStaff;
    }

    public void setTotalStaff(Integer totalStaff) {
        this.totalStaff = totalStaff;
    }

    public Integer getPresentStaff() {
        return presentStaff;
    }

    public void setPresentStaff(Integer presentStaff) {
        this.presentStaff = presentStaff;
    }

    public Integer getAbsentStaff() {
        return absentStaff;
    }

    public void setAbsentStaff(Integer absentStaff) {
        this.absentStaff = absentStaff;
    }

    public Integer getBeneficiariesPresent() {
        return beneficiariesPresent;
    }

    public void setBeneficiariesPresent(Integer beneficiariesPresent) {
        this.beneficiariesPresent = beneficiariesPresent;
    }
}
