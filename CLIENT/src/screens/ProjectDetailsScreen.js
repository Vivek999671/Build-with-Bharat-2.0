import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_PROJECTS } from '../data/mockData';

export default function ProjectDetailsScreen({ navigation, route }) {
  const project = route.params?.project || MOCK_PROJECTS[0];

  const isCritical = project.riskScore >= 75;
  const isMedium = project.riskScore >= 50 && project.riskScore < 75;

  const riskBg = isCritical
    ? COLORS.criticalBg
    : isMedium
    ? COLORS.warningBg
    : COLORS.successBg;

  const riskColor = isCritical
    ? COLORS.criticalText
    : isMedium
    ? COLORS.warningText
    : COLORS.successText;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>{project.id}</Text>
            </View>
            <View style={[styles.riskPill, { backgroundColor: riskBg }]}>
              <Ionicons
                name={isCritical ? 'warning' : isMedium ? 'alert-circle' : 'shield-checkmark'}
                size={14}
                color={riskColor}
              />
              <Text style={[styles.riskPillText, { color: riskColor }]}>
                Risk Score: {project.riskScore}/100 ({project.riskLevel})
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{project.name}</Text>
          <Text style={styles.heroOrg}>{project.organization}</Text>

          <View style={styles.schemeTag}>
            <Ionicons name="ribbon" size={14} color={COLORS.primary} />
            <Text style={styles.schemeTagText}>{project.scheme}</Text>
          </View>

          <View style={styles.heroFooter}>
            <View style={styles.locationWrap}>
              <Ionicons name="location" size={16} color={COLORS.primary} />
              <Text style={styles.heroLocation}>{project.location}</Text>
            </View>
            <View style={styles.cctvStatusBadge}>
              <View
                style={[
                  styles.cctvDot,
                  {
                    backgroundColor:
                      project.cctvStatus === 'ONLINE'
                        ? COLORS.success
                        : COLORS.critical,
                  },
                ]}
              />
              <Text style={styles.cctvText}>CCTV: {project.cctvStatus}</Text>
            </View>
          </View>
        </View>

        {/* Key Metrics 4-Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>COMPLIANCE SCORE</Text>
            <Text style={styles.statValue}>{project.complianceScore}%</Text>
            <Text style={styles.statSub}>Target: &gt; 80%</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ATTENDANCE RATE</Text>
            <Text
              style={[
                styles.statValue,
                project.attendanceRate < 80 && { color: COLORS.critical },
              ]}
            >
              {project.attendanceRate}%
            </Text>
            <Text style={styles.statSub}>
              {project.presentStaff}/{project.totalStaff} staff verified
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>BENEFICIARIES</Text>
            <Text style={styles.statValue}>{project.beneficiaries}</Text>
            <Text style={styles.statSub}>Registered active</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>STATUS</Text>
            <Text style={[styles.statValue, { color: COLORS.primary, fontSize: 16 }]}>
              {project.status}
            </Text>
            <Text style={styles.statSub}>Active Scheme</Text>
          </View>
        </View>

        {/* Inspection Schedule Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>INSPECTION TIMELINE</Text>
          
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconWrap}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            </View>
            <View style={styles.timelineInfo}>
              <Text style={styles.timelineTitle}>Last Field Inspection</Text>
              <Text style={styles.timelineDate}>{project.lastInspection}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>

          <View style={styles.timelineDivider} />

          <View style={styles.timelineRow}>
            <View style={styles.timelineIconWrap}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.info} />
            </View>
            <View style={styles.timelineInfo}>
              <Text style={styles.timelineTitle}>Next Scheduled Review</Text>
              <Text style={styles.timelineDate}>{project.nextInspection}</Text>
            </View>
          </View>
        </View>

        {/* GPS Geofence & Location Coordinates */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>GEO-COORDINATES & AUDIT TRAIL</Text>
          <View style={styles.geoRow}>
            <View style={styles.geoItem}>
              <Text style={styles.geoLabel}>Latitude</Text>
              <Text style={styles.geoValue}>
                {project.latitude != null
                  ? `${project.latitude}° N`
                  : project.coordinates?.latitude != null
                  ? `${project.coordinates.latitude}° N`
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.geoItem}>
              <Text style={styles.geoLabel}>Longitude</Text>
              <Text style={styles.geoValue}>
                {project.longitude != null
                  ? `${project.longitude}° E`
                  : project.coordinates?.longitude != null
                  ? `${project.coordinates.longitude}° E`
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.geoItem}>
              <Text style={styles.geoLabel}>Geofence</Text>
              <Text style={styles.geoValue}>150m Radius</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsCol}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => navigation.navigate('ConductInspection', { project })}
            activeOpacity={0.85}
          >
            <Ionicons name="play-circle" size={20} color="#ffffff" />
            <Text style={styles.primaryActionBtnText}>Start Field Inspection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionBtn}
            onPress={() => navigation.navigate('RandomAssignment', { project })}
            activeOpacity={0.85}
          >
            <Ionicons name="shuffle" size={18} color={COLORS.primary} />
            <Text style={styles.secondaryActionBtnText}>
              Assign Inspector (Manual / Random)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineActionBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'InspectionsTab' })}
            activeOpacity={0.85}
          >
            <Ionicons name="document-text-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.outlineActionBtnText}>View Inspection History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
    marginBottom: SPACING.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  riskPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  riskPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  heroOrg: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  schemeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  schemeTagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroLocation: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  cctvStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cctvDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  cctvText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  statSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  verifiedBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.successText,
  },
  timelineDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
    marginLeft: 42,
  },
  geoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    padding: 10,
  },
  geoItem: {
    alignItems: 'center',
  },
  geoLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  geoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  actionButtonsCol: {
    gap: 10,
    marginTop: SPACING.sm,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.card,
  },
  primaryActionBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  secondaryActionBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineActionBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  outlineActionBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
