package com.dosje.monitoring.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignInspectionRequest {

    @NotBlank(message = "Project ID is required")
    private String projectId;

    @NotBlank(message = "Inspector ID is required")
    private String inspectorId;

    private String scheduledDate;
    private String scheduledTime;
    private String priority = "Normal";

    public AssignInspectionRequest() {
    }

    public AssignInspectionRequest(String projectId, String inspectorId, String scheduledDate,
                                   String scheduledTime, String priority) {
        this.projectId = projectId;
        this.inspectorId = inspectorId;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.priority = priority;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getInspectorId() {
        return inspectorId;
    }

    public void setInspectorId(String inspectorId) {
        this.inspectorId = inspectorId;
    }

    public String getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(String scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
