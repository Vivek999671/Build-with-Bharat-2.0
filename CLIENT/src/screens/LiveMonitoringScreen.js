import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_PROJECTS } from '../data/mockData';

const { width } = Dimensions.get('window');

export default function LiveMonitoringScreen({ navigation }) {
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Top Status Strip */}
      <View style={styles.statusStrip}>
        <View style={styles.statusItem}>
          <Text style={styles.statusVal}>112</Text>
          <Text style={styles.statusLbl}>Online Projects</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={[styles.statusVal, { color: COLORS.info }]}>24</Text>
          <Text style={styles.statusLbl}>Active Audits</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={[styles.statusVal, { color: COLORS.critical }]}>8</Text>
          <Text style={styles.statusLbl}>High Risk</Text>
        </View>
      </View>

      {/* Simulated GIS Interactive Map Canvas */}
      <View style={styles.mapCanvas}>
        {/* Map Grid Background Pattern */}
        <View style={styles.mapGridPattern} />

        {/* Map Overlay Header */}
        <View style={styles.mapControls}>
          <View style={styles.gpsLockTag}>
            <View style={styles.pulseDot} />
            <Text style={styles.gpsLockText}>GIS Live Feed Active • Maharashtra Region</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshMapBtn}
            onPress={() => setSelectedProject(MOCK_PROJECTS[0])}
          >
            <Ionicons name="locate" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Interactive GIS Markers */}
        <View style={styles.markersContainer}>
          {MOCK_PROJECTS.map((proj, idx) => {
            const isSelected = selectedProject.id === proj.id;
            const isCrit = proj.riskScore >= 75;
            const isMed = proj.riskScore >= 50 && proj.riskScore < 75;

            const markerColor = isCrit
              ? COLORS.critical
              : isMed
              ? COLORS.warning
              : COLORS.success;

            // Positioning on simulated canvas
            const topPositions = [50, 130, 210, 290];
            const leftPositions = [40, 160, 240, 90];

            return (
              <TouchableOpacity
                key={proj.id}
                style={[
                  styles.markerWrap,
                  {
                    top: topPositions[idx % 4],
                    left: leftPositions[idx % 4],
                  },
                ]}
                onPress={() => setSelectedProject(proj)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.markerBubble,
                    { backgroundColor: markerColor },
                    isSelected && styles.markerBubbleSelected,
                  ]}
                >
                  <Ionicons name="business" size={14} color="#ffffff" />
                </View>
                <Text style={styles.markerLabel}>{proj.id}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Project Quick Card */}
        {selectedProject && (
          <View style={styles.selectedProjectCard}>
            <View style={styles.selectedTopRow}>
              <View style={styles.selectedIdBadge}>
                <Text style={styles.selectedIdText}>{selectedProject.id}</Text>
              </View>
              <View
                style={[
                  styles.selectedRiskBadge,
                  {
                    backgroundColor:
                      selectedProject.riskScore >= 75
                        ? COLORS.criticalBg
                        : selectedProject.riskScore >= 50
                        ? COLORS.warningBg
                        : COLORS.successBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.selectedRiskText,
                    {
                      color:
                        selectedProject.riskScore >= 75
                          ? COLORS.criticalText
                          : selectedProject.riskScore >= 50
                          ? COLORS.warningText
                          : COLORS.successText,
                    },
                  ]}
                >
                  Risk: {selectedProject.riskScore}/100
                </Text>
              </View>
            </View>

            <Text style={styles.selectedTitle}>{selectedProject.name}</Text>
            <Text style={styles.selectedSub}>
              {selectedProject.location} • Attendance: {selectedProject.attendanceRate}%
            </Text>

            <View style={styles.selectedActions}>
              <TouchableOpacity
                style={styles.actionOutlineBtn}
                onPress={() => navigation.navigate('ProjectDetails', { project: selectedProject })}
              >
                <Text style={styles.actionOutlineText}>Project Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionPrimaryBtn}
                onPress={() => navigation.navigate('ConductInspection', { project: selectedProject })}
              >
                <Text style={styles.actionPrimaryText}>Inspect Now</Text>
                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statusStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusVal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statusLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statusDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#e2ece9',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGridPattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d8e5e1',
    opacity: 0.5,
  },
  mapControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    zIndex: 10,
  },
  gpsLockTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    ...SHADOWS.subtle,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
  },
  gpsLockText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  refreshMapBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  markersContainer: {
    flex: 1,
    position: 'relative',
  },
  markerWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerBubble: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    ...SHADOWS.floating,
  },
  markerBubbleSelected: {
    borderColor: '#000000',
    transform: [{ scale: 1.2 }],
  },
  markerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 4,
    borderRadius: 3,
    marginTop: 2,
  },
  selectedProjectCard: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.floating,
  },
  selectedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectedIdBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  selectedIdText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  selectedRiskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  selectedRiskText: {
    fontSize: 10,
    fontWeight: '800',
  },
  selectedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  selectedSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  selectedActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionOutlineBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  actionOutlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  actionPrimaryBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  actionPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});
