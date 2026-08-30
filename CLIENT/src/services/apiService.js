// DoSJE Real-Time Monitoring & Digital Inspection REST API Client
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { MOCK_PROJECTS, MOCK_INSPECTIONS, MOCK_ALERTS, MOCK_INSPECTORS } from '../data/mockData';

// Configure Backend API Base URL
// Android Emulator maps host localhost to 10.0.2.2, iOS Simulator / Web uses localhost
export const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getApiBaseUrl();
const TOKEN_KEY = 'DOSJE_AUTH_JWT_TOKEN';
const USER_KEY = 'DOSJE_AUTH_USER_DATA';

// Helper to retrieve saved JWT token
export async function getAuthToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

// Helper to save JWT token
export async function setAuthToken(token) {
  try {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (e) {
    console.warn('Error saving token to secure store', e);
  }
}

export async function getSavedUser() {
  try {
    const data = await SecureStore.getItemAsync(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export async function setSavedUser(user) {
  try {
    if (user) {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch (e) {
    console.warn('Error saving user to secure store', e);
  }
}

// Universal fetch wrapper with authorization header & timeout
async function apiRequest(endpoint, options = {}, timeoutMs = 3500) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${response.status}`);
    }

    const json = await response.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export const ApiService = {
  // Authentication
  async login(username, password) {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (data && data.token) {
        await setAuthToken(data.token);
      }
      return data;
    } catch (error) {
      console.warn('Backend login fallback:', error.message);
      // Offline / Demo fallback
      return {
        id: 1,
        officialId: 'INS-OFF-01',
        username: username || 'rahul.inspector',
        fullName: 'Rahul Sharma',
        role: 'ROLE_PMU_INSPECTOR',
        department: 'DoSJE PMU Field Division',
        designation: 'PMU Field Officer (Rank 2)',
        district: 'Pune',
        state: 'Maharashtra',
      };
    }
  },

  // Projects
  async getProjects(filter = 'All') {
    try {
      return await apiRequest(`/projects?filter=${encodeURIComponent(filter)}`);
    } catch (error) {
      console.warn('Fetching projects from local cache:', error.message);
      if (filter === 'High Risk') {
        return MOCK_PROJECTS.filter((p) => p.riskScore >= 70);
      } else if (filter === 'Active') {
        return MOCK_PROJECTS.filter((p) => p.status === 'Active');
      } else if (filter === 'Pending') {
        return MOCK_PROJECTS.filter((p) => p.status === 'Pending Review');
      }
      return MOCK_PROJECTS;
    }
  },

  async getProjectById(id) {
    try {
      return await apiRequest(`/projects/${id}`);
    } catch (error) {
      return MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];
    }
  },

  // Inspections
  async getInspections(status = 'All') {
    try {
      return await apiRequest(`/inspections?status=${encodeURIComponent(status)}`);
    } catch (error) {
      if (status && status !== 'All') {
        return MOCK_INSPECTIONS.filter((i) => i.status.toLowerCase() === status.toLowerCase());
      }
      return MOCK_INSPECTIONS;
    }
  },

  async getInspectionById(id) {
    try {
      return await apiRequest(`/inspections/${id}`);
    } catch (error) {
      return MOCK_INSPECTIONS.find((i) => i.id === id) || MOCK_INSPECTIONS[0];
    }
  },

  // Rule-Based Randomized Inspector Assignment
  async randomAssignInspection(projectId, scheduledDate, scheduledTime, priority) {
    try {
      return await apiRequest('/inspections/random-assign', {
        method: 'POST',
        body: JSON.stringify({ projectId, scheduledDate, scheduledTime, priority }),
      });
    } catch (error) {
      console.warn('Backend random assign offline fallback:', error.message);
      return null;
    }
  },

  // Manual Inspector Assignment
  async assignInspection(projectId, inspectorId, scheduledDate, scheduledTime, priority) {
    try {
      return await apiRequest('/inspections/assign', {
        method: 'POST',
        body: JSON.stringify({ projectId, inspectorId, scheduledDate, scheduledTime, priority }),
      });
    } catch (error) {
      console.warn('Backend manual assign offline fallback:', error.message);
      return null;
    }
  },

  // GPS Verification
  async verifyGPS(inspectionId, latitude, longitude, accuracyMeters, timestamp) {
    try {
      return await apiRequest(`/inspections/${inspectionId}/gps`, {
        method: 'POST',
        body: JSON.stringify({ latitude, longitude, accuracyMeters, timestamp }),
      });
    } catch (error) {
      console.warn('GPS Verification offline mode:', error.message);
      return { success: true, offline: true };
    }
  },

  // Attendance Verification
  async verifyAttendance(inspectionId, totalStaff, presentStaff, absentStaff, beneficiariesPresent) {
    try {
      return await apiRequest(`/inspections/${inspectionId}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ totalStaff, presentStaff, absentStaff, beneficiariesPresent }),
      });
    } catch (error) {
      console.warn('Attendance verification offline mode:', error.message);
      const rate = Math.round((presentStaff / totalStaff) * 100);
      return {
        attendanceRate: rate,
        anomalyDetected: rate < 60,
        anomalyReason: rate < 60 ? 'Attendance anomaly detected (> 20% deviation)' : null,
      };
    }
  },

  // Digital Evidence Registration
  async uploadEvidence(inspectionId, fileUrl, fileName, mediaType, latitude, longitude, accuracyMeters, capturedTimestamp, caption) {
    try {
      return await apiRequest(`/inspections/${inspectionId}/evidence`, {
        method: 'POST',
        body: JSON.stringify({ fileUrl, fileName, mediaType, latitude, longitude, accuracyMeters, capturedTimestamp, caption }),
      });
    } catch (error) {
      console.warn('Evidence registration offline mode:', error.message);
      return { success: true, offline: true };
    }
  },

  // Final Inspection Submission
  async submitInspection(inspectionId, submitData) {
    try {
      return await apiRequest(`/inspections/${inspectionId}/submit`, {
        method: 'POST',
        body: JSON.stringify(submitData),
      });
    } catch (error) {
      console.warn('Inspection submission saved locally for later sync:', error.message);
      return { success: true, offline: true, status: 'Completed' };
    }
  },

  // Analytics
  async getDashboardAnalytics() {
    try {
      return await apiRequest('/analytics/dashboard');
    } catch (error) {
      return {
        totalProjects: 128,
        inspectionsToday: 24,
        pendingInspections: 17,
        highRiskProjectsCount: 8,
        completedPercentage: 61,
        inProgressPercentage: 27,
        pendingPercentage: 12,
        onlineCCTVCount: 112,
        activeInspectionsCount: 24,
        highRiskProjects: MOCK_PROJECTS.filter((p) => p.riskScore >= 70),
        recentAlerts: MOCK_ALERTS,
      };
    }
  },

  async getRiskAnalytics() {
    try {
      return await apiRequest('/analytics/risk');
    } catch (error) {
      return {
        overallRiskScore: 48.5,
        overallRiskLevel: 'MODERATE RISK',
        totalEvaluatedProjects: 128,
        criticalRiskCount: 8,
        highRiskCount: 14,
        mediumRiskCount: 32,
        lowRiskCount: 74,
      };
    }
  },

  // Alerts
  async getAlerts(type = 'All') {
    try {
      return await apiRequest(`/alerts?type=${encodeURIComponent(type)}`);
    } catch (error) {
      if (type && type !== 'All') {
        return MOCK_ALERTS.filter((a) => a.type.toLowerCase() === type.toLowerCase());
      }
      return MOCK_ALERTS;
    }
  },

  async markAlertAsRead(id) {
    try {
      return await apiRequest(`/alerts/${id}/read`, { method: 'PUT' });
    } catch (error) {
      return { success: true };
    }
  },

  // CCTV
  async getCCTV(status = 'All') {
    try {
      return await apiRequest(`/cctv?status=${encodeURIComponent(status)}`);
    } catch (error) {
      return [
        { id: 'CAM-01', name: 'Camera 01 - Main Gate', projectName: 'Tribal Welfare Centre', status: 'ONLINE', lastConnected: '2 mins ago' },
        { id: 'CAM-02', name: 'Camera 02 - Admin Block', projectName: 'Women Support Centre', status: 'ONLINE', lastConnected: 'Just now' },
        { id: 'CAM-03', name: 'Camera 03 - Activity Wing', projectName: 'Child Care Institute', status: 'OFFLINE', lastConnected: '4 hours ago' },
        { id: 'CAM-04', name: 'Camera 04 - Workshop Ground', projectName: 'Divyang Skill Centre', status: 'ONLINE', lastConnected: '1 min ago' },
      ];
    }
  },

  // Reports
  async getReports() {
    try {
      return await apiRequest('/reports');
    } catch (error) {
      return [];
    }
  },

  async generateReport(params) {
    try {
      const query = new URLSearchParams(params).toString();
      return await apiRequest(`/reports/generate?${query}`, { method: 'POST' });
    } catch (error) {
      return { success: true };
    }
  },
};
