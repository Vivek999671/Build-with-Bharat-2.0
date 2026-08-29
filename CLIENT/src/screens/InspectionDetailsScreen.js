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
import { MOCK_INSPECTIONS } from '../data/mockData';

export default function InspectionDetailsScreen({ navigation, route }) {
  const inspection = route.params?.inspection || MOCK_INSPECTIONS[0];

  const isCompleted = inspection.status === 'Completed';
  const isFlagged = inspection.status === 'Flagged';

  const statusBg = isCompleted
    ? COLORS.successBg
    : isFlagged
    ? COLORS.criticalBg
    : COLORS.infoBg;

  const statusColor = isCompleted
    ? COLORS.successText
    : isFlagged
    ? COLORS.criticalText
    : COLORS.infoText;

  const isHighRisk = inspection.riskLevel === 'Critical' || inspection.riskLevel === 'High';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idBadgeText}>{inspection.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                {inspection.status}
              </Text>
            </View>
          </View>

          <Text style={styles.projectName}>{inspection.projectName}</Text>
          <Text style={styles.orgName}>{inspection.organization}</Text>

          {/* Allocation Badge */}
          <View style={styles.allocationBadge}>
            <Ionicons name="sparkles" size={13} color={COLORS.primary} />
            <Text style={styles.allocationText}>
              Allocation: {inspection.allocationMethod}
            </Text>
          </View>
        </View>

        {/* Inspector Profile Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>ASSIGNED FIELD INSPECTOR</Text>
          <View style={styles.inspectorRow}>
            <View style={styles.inspectorAvatar}>
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.inspectorDetails}>
              <Text style={styles.inspectorName}>{inspection.inspectorName}</Text>
              <Text style={styles.inspectorRole}>{inspection.inspectorRole}</Text>
              <View style={styles.distanceBadge}>
                <Ionicons name="navigate" size={12} color={COLORS.primary} />
                <Text style={styles.distanceText}>
                  Current Distance: {inspection.distance}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Schedule & Location Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>SCHEDULE & GEO-LOCATION</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Scheduled Date</Text>
              <Text style={styles.infoValue}>{inspection.scheduledDate}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Scheduled Time</Text>
              <Text style={styles.infoValue}>{inspection.scheduledTime}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>District / State</Text>
              <Text style={styles.infoValue}>{inspection.location}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>GPS Coordinates</Text>
              <Text style={styles.infoValue}>
                {inspection.coordinates.latitude}, {inspection.coordinates.longitude}
              </Text>
            </View>
          </View>
        </View>

        {/* Verification Metrics Card */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>COMPLIANCE SCORE</Text>
            <Text style={styles.metricValue}>{inspection.compliance} / 100</Text>
            <Text style={styles.metricSub}>Audit benchmark &gt; 80</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>STAFF ATTENDANCE</Text>
            <Text
              style={[
                styles.metricValue,
                inspection.attendance < 80 && { color: COLORS.critical },
              ]}
            >
              {inspection.attendance}%
            </Text>
            <Text style={styles.metricSub}>Biometric verified</Text>
          </View>
        </View>

        {/* Evidence Verification Checklist */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>DIGITAL EVIDENCE AUDIT TRAIL</Text>
          <View style={styles.evidenceItem}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.evidenceText}>Geo-Tagged GPS Location Lock</Text>
          </View>
          <View style={styles.evidenceItem}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.evidenceText}>Time-Stamped Photographic Evidence</Text>
          </View>
          <View style={styles.evidenceItem}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.evidenceText}>On-Site Beneficiary Verification</Text>
          </View>
          <View style={styles.evidenceItem}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'time-outline'}
              size={18}
              color={isCompleted ? COLORS.success : COLORS.warning}
            />
            <Text style={styles.evidenceText}>
              {isCompleted ? 'Final Report Digitally Signed' : 'Final Report Pending Submission'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionCol}>
          {!isCompleted && (
            <TouchableOpacity
              style={styles.startActionBtn}
              onPress={() => navigation.navigate('ConductInspection', { inspection })}
              activeOpacity={0.85}
            >
              <Ionicons name="play-circle" size={20} color="#ffffff" />
              <Text style={styles.startActionBtnText}>Conduct Field Inspection</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() =>
              Alert.alert(
                'Digital Evidence Archive',
                'Inspection Geo-Evidence files (Photos, GPS Logs, Timestamp tokens) are secured in the e-NirikShan Cloud Vault.'
              )
            }
            activeOpacity={0.8}
          >
            <Ionicons name="images-outline" size={18} color={COLORS.primary} />
            <Text style={styles.outlineBtnText}>View Geo-Tagged Evidence</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => navigation.navigate('Reports')}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.reportBtnText}>Download Official Audit PDF</Text>
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
    marginBottom: SPACING.md,
    ...SHADOWS.card,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  projectName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  orgName: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  allocationBadge: {
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
  allocationText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
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
  inspectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspectorAvatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inspectorDetails: {
    flex: 1,
  },
  inspectorName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inspectorRole: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  distanceText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCol: {
    width: '47%',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  metricSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  evidenceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionCol: {
    gap: 10,
    marginTop: SPACING.xs,
  },
  startActionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.card,
  },
  startActionBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  outlineBtn: {
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
  outlineBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  reportBtn: {
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
  reportBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
