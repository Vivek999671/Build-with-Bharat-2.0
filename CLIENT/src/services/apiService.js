// DoSJE Real-Time Monitoring & Digital Inspection REST API Client
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Configure Backend API Base URL
// Configurable via EXPO_PUBLIC_API_URL environment variable, with fallback for local dev
export const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }
  return 'http://localhost:8080/api';
};
//temporary 


const API_BASE_URL = getApiBaseUrl();

console.log('API BASE URL:', API_BASE_URL);
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

// Universal fetch wrapper with Bearer token & timeout
async function apiRequest(endpoint, options = {}, timeoutMs = 6000) {
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
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (data && data.token) {
      await setAuthToken(data.token);
      await setSavedUser(data);
    }
    return data;
  },

  // Projects
  async getProjects(filter = 'All') {
    return await apiRequest(`/projects?filter=${encodeURIComponent(filter)}`);
  },

  async getProjectById(id) {
    return await apiRequest(`/projects/${id}`);
  },

  // Inspections
  async getInspections(status = 'All') {
    return await apiRequest(`/inspections?status=${encodeURIComponent(status)}`);
  },

  async getInspectionById(id) {
    return await apiRequest(`/inspections/${id}`);
  },

  // Rule-Based Randomized Inspector Assignment
  async randomAssignInspection(projectId, scheduledDate, scheduledTime, priority) {
    return await apiRequest('/inspections/random-assign', {
      method: 'POST',
      body: JSON.stringify({ projectId, scheduledDate, scheduledTime, priority }),
    });
  },

  // Manual Inspector Assignment
  async assignInspection(projectId, inspectorId, scheduledDate, scheduledTime, priority) {
    return await apiRequest('/inspections/assign', {
      method: 'POST',
      body: JSON.stringify({ projectId, inspectorId, scheduledDate, scheduledTime, priority }),
    });
  },

  // GPS Verification
  async verifyGPS(inspectionId, latitude, longitude, accuracyMeters, timestamp) {
    return await apiRequest(`/inspections/${inspectionId}/gps`, {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, accuracyMeters, timestamp }),
    });
  },

  // Attendance Verification
  async verifyAttendance(inspectionId, totalStaff, presentStaff, absentStaff, beneficiariesPresent) {
    return await apiRequest(`/inspections/${inspectionId}/attendance`, {
      method: 'POST',
      body: JSON.stringify({ totalStaff, presentStaff, absentStaff, beneficiariesPresent }),
    });
  },

  // Multipart Evidence Photo / Video Upload to Spring Boot -> Supabase Storage -> PostgreSQL
  async uploadEvidenceFile(inspectionId, fileUri, metadata = {}) {
    const token = await getAuthToken();
    const formData = new FormData();

    const uriParts = fileUri.split('/');
    const fileName = metadata.fileName || uriParts[uriParts.length - 1] || `evidence_${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(fileName);
    const type = metadata.mediaType === 'VIDEO' ? 'video/mp4' : (match ? `image/${match[1]}` : 'image/jpeg');

    formData.append('file', {
      uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
      name: fileName,
      type,
    });

    if (metadata.fileName) formData.append('fileName', metadata.fileName);
    if (metadata.mediaType) formData.append('mediaType', metadata.mediaType);
    if (metadata.latitude != null) formData.append('latitude', String(metadata.latitude));
    if (metadata.longitude != null) formData.append('longitude', String(metadata.longitude));
    if (metadata.accuracyMeters != null) formData.append('accuracyMeters', String(metadata.accuracyMeters));
    if (metadata.capturedTimestamp) formData.append('capturedTimestamp', metadata.capturedTimestamp);
    if (metadata.caption) formData.append('caption', metadata.caption);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000); // 15s timeout for media upload

    try {
      const response = await fetch(`${API_BASE_URL}/inspections/${inspectionId}/evidence/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  },

  // Digital Evidence Registration (JSON metadata fallback)
  async uploadEvidence(inspectionId, fileUrl, fileName, mediaType, latitude, longitude, accuracyMeters, capturedTimestamp, caption) {
    return await apiRequest(`/inspections/${inspectionId}/evidence`, {
      method: 'POST',
      body: JSON.stringify({ fileUrl, fileName, mediaType, latitude, longitude, accuracyMeters, capturedTimestamp, caption }),
    });
  },

  // Final Inspection Submission
  async submitInspection(inspectionId, submitData) {
    return await apiRequest(`/inspections/${inspectionId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submitData),
    });
  },

  // Analytics
  async getDashboardAnalytics() {
    return await apiRequest('/analytics/dashboard');
  },

  async getRiskAnalytics() {
    return await apiRequest('/analytics/risk');
  },

  // Alerts
  async getAlerts(type = 'All') {
    return await apiRequest(`/alerts?type=${encodeURIComponent(type)}`);
  },

  async markAlertAsRead(id) {
    return await apiRequest(`/alerts/${id}/read`, { method: 'PUT' });
  },

  // CCTV
  async getCCTV(status = 'All') {
    return await apiRequest(`/cctv?status=${encodeURIComponent(status)}`);
  },

  // Reports
  async getReports() {
    return await apiRequest('/reports');
  },

  async generateReport(params) {
    const query = new URLSearchParams(params).toString();
    return await apiRequest(`/reports/generate?${query}`, { method: 'POST' });
  },
};
