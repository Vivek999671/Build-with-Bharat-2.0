/**
 * Rule-based Anomaly Detection Engine
 * According to DoSJE Digital Inspection guidelines
 */

export function calculateRiskScore({
  attendanceRate = 100,
  complianceScore = 100,
  isOverdue = false,
  cctvOnline = true,
}) {
  let score = 0;

  // Attendance penalty
  if (attendanceRate < 50) score += 40;
  else if (attendanceRate < 75) score += 25;
  else if (attendanceRate < 90) score += 10;

  // Compliance penalty
  if (complianceScore < 50) score += 35;
  else if (complianceScore < 75) score += 20;
  else if (complianceScore < 90) score += 10;

  // Operational penalties
  if (isOverdue) score += 20;
  if (!cctvOnline) score += 15;

  return Math.min(Math.max(score, 10), 100);
}

export function detectAnomalies(project) {
  const anomalies = [];

  // Rule 1: Attendance drop > 20%
  if (project.attendanceRate < 80) {
    anomalies.push({
      id: 'ANOM-ATT',
      title: 'Attendance Anomaly Detected',
      level: project.attendanceRate < 50 ? 'CRITICAL' : 'WARNING',
      reason: `Recorded staff attendance is ${project.attendanceRate}%, which is below the 80% mandatory threshold.`,
    });
  }

  // Rule 2: CCTV Offline
  if (project.cctvStatus === 'OFFLINE') {
    anomalies.push({
      id: 'ANOM-CCTV',
      title: 'CCTV Stream Offline',
      level: 'MEDIUM',
      reason: 'CCTV monitoring feed has been unresponsive.',
    });
  }

  // Rule 3: High Risk Score > 80
  if (project.riskScore >= 80) {
    anomalies.push({
      id: 'ANOM-RISK',
      title: 'High Risk Profile Flagged',
      level: 'CRITICAL',
      reason: 'Multiple risk factors combined exceeded critical threshold score of 80.',
    });
  }

  return anomalies;
}
