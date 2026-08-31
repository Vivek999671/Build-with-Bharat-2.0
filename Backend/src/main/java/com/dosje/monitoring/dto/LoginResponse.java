package com.dosje.monitoring.dto;

import com.dosje.monitoring.entity.Role;

public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String officialId;
    private String username;
    private String fullName;
    private String email;
    private Role role;
    private String department;
    private String designation;
    private String district;
    private String state;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long id, String officialId, String username, String fullName,
                         String email, Role role, String department, String designation,
                         String district, String state) {
        this.token = token;
        this.id = id;
        this.officialId = officialId;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.district = district;
        this.state = state;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOfficialId() {
        return officialId;
    }

    public void setOfficialId(String officialId) {
        this.officialId = officialId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
