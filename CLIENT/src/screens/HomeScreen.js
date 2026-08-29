import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_PROJECTS, MOCK_INSPECTIONS, MOCK_ALERTS } from '../data/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
  const userRole = route.params?.userRole || 'DoSJE Official';
  const isInspector = userRole === 'PMU Inspector';

  const upcomingInspection = MOCK_INSPECTIONS[0];
  const highRiskProject = MOCK_PROJECTS.find((p) => p.riskScore >= 80) || MOCK_PROJECTS[2];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield" size={18} color="#ffffff" />
            </View>
            <Text style={styles.brandTitle}>e-NirikShan</Text>
          </View>
          <Text style={styles.greetingText}>
            {isInspector ? 'Good Morning, Rahul 👋' : 'Good Morning, Admin 👋'}
          </Text>
          <View style={styles.deptPill}>
            <Text style={styles.deptPillText}>
              {userRole} • {isInspector ? 'Pune Field Sector' : 'Central Monitoring Cell'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AlertsTab')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileAvatar}
            onPress={() => navigation.navigate('ProfileTab')}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= INSPECTOR-CENTRIC VIEW (SCREEN 9) ================= */}
        {isInspector ? (
          <>
            {/* Today's Inspection Target Card */}
            <View style={styles.inspectorHeroCard}>
              <View style={styles.inspectorHeroTop}>
                <View>
                  <Text style={styles.targetLabel}>TODAY'S FIELD ASSIGNMENTS</Text>
                  <Text style={styles.targetCount}>2 Inspections</Text>
                </View>
                <View style={styles.targetBadge}>
                  <Ionicons name="location" size={14} color={COLORS.primary} />
                  <Text style={styles.targetBadgeText}>Pune Sector 4</Text>
                </View>
              </View>

              <View style={styles.inspectorStatsRow}>
                <View style={styles.inspStatItem}>
                  <Text style={[styles.inspStatVal, { color: COLORS.success }]}>1</Text>
                  <Text style={styles.inspStatLbl}>Completed Today</Text>
                </View>
                <View style={styles.inspStatDivider} />
                <View style={styles.inspStatItem}>
                  <Text style={[styles.inspStatVal, { color: COLORS.warning }]}>1</Text>
                  <Text style={styles.inspStatLbl}>Pending Field Visit</Text>
                </View>
              </View>
            </View>

            {/* Upcoming Inspection Priority Card */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NEXT UPCOMING INSPECTION</Text>
              <Text style={styles.timePrompt}>Scheduled: 11:30 AM</Text>
            </View>

            <View style={styles.upcomingCard}>
              <View style={styles.upcomingTop}>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>{upcomingInspection.id}</Text>
                </View>
                <View style={styles.distBadge}>
                  <Ionicons name="navigate" size={12} color={COLORS.primary} />
                  <Text style={styles.distBadgeText}>{upcomingInspection.distance} away</Text>
                </View>
              </View>

              <Text style={styles.upcomingTitle}>{upcomingInspection.projectName}</Text>
              <Text style={styles.upcomingOrg}>{upcomingInspection.organization}</Text>

              <View style={styles.upcomingMetaRow}>
                <View style={styles.upcomingMetaItem}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.upcomingMetaText}>{upcomingInspection.location}</Text>
                </View>
                <View style={styles.upcomingMetaItem}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.upcomingMetaText}>11:30 AM Today</Text>
                </View>
              </View>

              {/* Inspector Action Buttons */}
              <View style={styles.upcomingActions}>
                <TouchableOpacity
                  style={styles.navBtn}
                  onPress={() =>
                    Alert.alert(
                      'Turn-by-Turn Navigation',
                      `Opening GPS Navigation to ${upcomingInspection.projectName} (${upcomingInspection.distance}). Coordinates: 18.5204, 73.8567`
                    )
                  }
                >
                  <Ionicons name="navigate" size={16} color={COLORS.primary} />
                  <Text style={styles.navBtnText}>Navigate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsOutlineBtn}
                  onPress={() =>
                    navigation.navigate('InspectionDetails', {
                      inspection: upcomingInspection,
                    })
                  }
                >
                  <Text style={styles.detailsOutlineText}>Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.startDirectBtn}
                  onPress={() =>
                    navigation.navigate('ConductInspection', {
                      inspection: upcomingInspection,
                    })
                  }
                >
                  <Ionicons name="play" size={14} color="#ffffff" />
                  <Text style={styles.startDirectText}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          /* ================= CENTRAL / STATE OFFICIAL VIEW (SCREEN 3) ================= */
          <>
            {/* 4 Statistics Cards (2x2 Grid) */}
            <View style={styles.statsGrid}>
              <TouchableOpacity
                style={[styles.statCard, { borderLeftColor: COLORS.info }]}
                onPress={() => navigation.navigate('ProjectsTab')}
                activeOpacity={0.8}
              >
                <View style={styles.statTopRow}>
                  <Text style={styles.statLabel}>Total Projects</Text>
                  <View style={[styles.statIconWrap, { backgroundColor: COLORS.infoBg }]}>
                    <Ionicons name="business" size={18} color={COLORS.info} />
                  </View>
                </View>
                <Text style={styles.statValue}>128</Text>
                <Text style={styles.statSubText}>+12 active this month</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, { borderLeftColor: COLORS.success }]}
                onPress={() => navigation.navigate('InspectionsTab')}
                activeOpacity={0.8}
              >
                <View style={styles.statTopRow}>
                  <Text style={styles.statLabel}>Today's Target</Text>
                  <View style={[styles.statIconWrap, { backgroundColor: COLORS.successBg }]}>
                    <Ionicons name="checkmark-done" size={18} color={COLORS.success} />
                  </View>
                </View>
                <Text style={styles.statValue}>24</Text>
                <Text style={[styles.statSubText, { color: COLORS.success }]}>
                  15 completed (62%)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, { borderLeftColor: COLORS.warning }]}
                onPress={() => navigation.navigate('InspectionsTab')}
                activeOpacity={0.8}
              >
                <View style={styles.statTopRow}>
                  <Text style={styles.statLabel}>Pending Tasks</Text>
                  <View style={[styles.statIconWrap, { backgroundColor: COLORS.warningBg }]}>
                    <Ionicons name="time-outline" size={18} color={COLORS.warning} />
                  </View>
                </View>
                <Text style={styles.statValue}>17</Text>
                <Text style={[styles.statSubText, { color: COLORS.warning }]}>
                  4 due today
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, { borderLeftColor: COLORS.critical }]}
                onPress={() => navigation.navigate('AlertsTab')}
                activeOpacity={0.8}
              >
                <View style={styles.statTopRow}>
                  <Text style={styles.statLabel}>High Risk</Text>
                  <View style={[styles.statIconWrap, { backgroundColor: COLORS.criticalBg }]}>
                    <Ionicons name="warning" size={18} color={COLORS.critical} />
                  </View>
                </View>
                <Text style={[styles.statValue, { color: COLORS.critical }]}>8</Text>
                <Text style={[styles.statSubText, { color: COLORS.critical }]}>
                  Requires inspection
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Quick Action Tiles */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          <TouchableOpacity
            style={styles.actionChip}
            onPress={() => navigation.navigate('RandomAssignment')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="shuffle" size={20} color="#0284c7" />
            </View>
            <Text style={styles.actionTitle}>Assign</Text>
            <Text style={styles.actionSubtitle}>Randomized</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChip}
            onPress={() => navigation.navigate('ConductInspection')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="location" size={20} color="#16a34a" />
            </View>
            <Text style={styles.actionTitle}>Inspect</Text>
            <Text style={styles.actionSubtitle}>GPS Field</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChip}
            onPress={() => navigation.navigate('LiveMonitoring')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="map" size={20} color="#d97706" />
            </View>
            <Text style={styles.actionTitle}>GIS Map</Text>
            <Text style={styles.actionSubtitle}>Live Feeds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChip}
            onPress={() => navigation.navigate('CCTV')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#fae8ff' }]}>
              <Ionicons name="videocam" size={20} color="#9333ea" />
            </View>
            <Text style={styles.actionTitle}>CCTV</Text>
            <Text style={styles.actionSubtitle}>Monitoring</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChip}
            onPress={() => navigation.navigate('RiskAnalytics')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="analytics" size={20} color="#dc2626" />
            </View>
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionSubtitle}>Anomalies</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChip}
            onPress={() => navigation.navigate('Reports')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#e2e8f0' }]}>
              <Ionicons name="document-text" size={20} color="#475569" />
            </View>
            <Text style={styles.actionTitle}>Reports</Text>
            <Text style={styles.actionSubtitle}>Audit Export</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Inspection Status Breakdown */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Inspection Status</Text>
              <Text style={styles.cardSubtitle}>Monthly performance overview</Text>
            </View>
            <View style={styles.complianceTag}>
              <Text style={styles.complianceTagText}>88% Target</Text>
            </View>
          </View>

          {/* Multi-Segment Progress Bar */}
          <View style={styles.progressBarWrapper}>
            <View style={[styles.progressSegment, { flex: 61, backgroundColor: COLORS.success }]} />
            <View style={[styles.progressSegment, { flex: 27, backgroundColor: COLORS.info }]} />
            <View style={[styles.progressSegment, { flex: 12, backgroundColor: COLORS.warning }]} />
          </View>

          {/* Legend Items */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.legendText}>Completed (61%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.info }]} />
              <Text style={styles.legendText}>In Progress (27%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
              <Text style={styles.legendText}>Pending (12%)</Text>
            </View>
          </View>
        </View>

        {/* High Risk Project Alert Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CRITICAL RISK ANOMALY</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AlertsTab')}>
            <Text style={styles.sectionAction}>View All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.riskCard}
          onPress={() => navigation.navigate('ProjectDetails', { project: highRiskProject })}
          activeOpacity={0.85}
        >
          <View style={styles.riskCardTop}>
            <View style={styles.riskBadge}>
              <Ionicons name="warning" size={14} color="#ffffff" />
              <Text style={styles.riskBadgeText}>Risk Score: {highRiskProject.riskScore}/100</Text>
            </View>
            <Text style={styles.riskTime}>Detected 10m ago</Text>
          </View>

          <Text style={styles.riskProjectName}>{highRiskProject.name}</Text>
          <Text style={styles.riskProjectOrg}>{highRiskProject.organization}</Text>

          <View style={styles.anomalyReasonBox}>
            <Ionicons name="alert-circle-outline" size={16} color={COLORS.critical} />
            <Text style={styles.anomalyReasonText}>
              Staff attendance dropped by 54% • CCTV stream offline
            </Text>
          </View>

          <View style={styles.riskCardFooter}>
            <View style={styles.riskLocationRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
              <Text style={styles.riskLocationText}>{highRiskProject.location}</Text>
            </View>
            <TouchableOpacity
              style={styles.inspectBtn}
              onPress={() => navigation.navigate('ConductInspection', { project: highRiskProject })}
            >
              <Text style={styles.inspectBtnText}>Inspect Now</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Recent Alerts Feed */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT AUDIT ALERTS</Text>
        </View>

        {MOCK_ALERTS.slice(0, 2).map((alert) => (
          <TouchableOpacity
            key={alert.id}
            style={styles.alertCard}
            onPress={() => navigation.navigate('AlertsTab')}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.alertIconWrap,
                {
                  backgroundColor:
                    alert.type === 'CRITICAL'
                      ? COLORS.criticalBg
                      : alert.type === 'HIGH'
                      ? COLORS.warningBg
                      : COLORS.infoBg,
                },
              ]}
            >
              <Ionicons
                name={
                  alert.type === 'CRITICAL'
                    ? 'alert-circle'
                    : alert.type === 'HIGH'
                    ? 'warning'
                    : 'information-circle'
                }
                size={20}
                color={
                  alert.type === 'CRITICAL'
                    ? COLORS.critical
                    : alert.type === 'HIGH'
                    ? COLORS.warning
                    : COLORS.info
                }
              />
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertHeaderRow}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertTime}>{alert.timestamp}</Text>
              </View>
              <Text style={styles.alertDesc} numberOfLines={2}>
                {alert.description}
              </Text>
              <Text style={styles.alertProject}>{alert.projectName}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Live GIS Map Preview Banner */}
        <TouchableOpacity
          style={styles.mapBanner}
          onPress={() => navigation.navigate('LiveMonitoring')}
          activeOpacity={0.85}
        >
          <View style={styles.mapBannerOverlay}>
            <View style={styles.mapBannerIcon}>
              <Ionicons name="navigate-circle" size={28} color="#ffffff" />
            </View>
            <View style={styles.mapBannerTextWrap}>
              <Text style={styles.mapBannerTitle}>Live GIS Monitoring Active</Text>
              <Text style={styles.mapBannerSubtitle}>
                112 Online Projects • 24 Active Field Inspections
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  headerLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  deptPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  deptPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.critical,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  inspectorHeroCard: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  inspectorHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  targetLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDim,
    letterSpacing: 0.8,
  },
  targetCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  targetBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  inspectorStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: RADIUS.md,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inspStatItem: {
    alignItems: 'center',
  },
  inspStatVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  inspStatLbl: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 2,
  },
  inspStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  timePrompt: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  upcomingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.primaryDim,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  upcomingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  distBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  upcomingOrg: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  upcomingMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
  },
  upcomingMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upcomingMetaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  upcomingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  detailsOutlineBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  detailsOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  startDirectBtn: {
    flex: 1.2,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  startDirectText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.md,
  },
  statCard: {
    width: (width - SPACING.md * 2 - 10) / 2,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 4,
    ...SHADOWS.subtle,
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statSubText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  sectionAction: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  quickActionsContainer: {
    gap: 10,
    paddingBottom: SPACING.sm,
  },
  actionChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    width: 86,
    ...SHADOWS.subtle,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionSubtitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  cardContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginVertical: SPACING.sm,
    ...SHADOWS.subtle,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  complianceTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  complianceTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarWrapper: {
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceContainer,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  riskCard: {
    backgroundColor: '#fff8f8',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  riskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskBadge: {
    backgroundColor: COLORS.critical,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  riskBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  riskTime: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  riskProjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  riskProjectOrg: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  anomalyReasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.criticalBg,
    padding: 8,
    borderRadius: RADIUS.sm,
    marginTop: 8,
    marginBottom: 10,
  },
  anomalyReasonText: {
    fontSize: 11,
    color: COLORS.criticalText,
    fontWeight: '600',
    flex: 1,
  },
  riskCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riskLocationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  inspectBtn: {
    backgroundColor: COLORS.critical,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  inspectBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  idBadge: {
    backgroundColor: COLORS.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  alertCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    ...SHADOWS.subtle,
  },
  alertIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  alertTime: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  alertDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  alertProject: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4,
  },
  mapBanner: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    ...SHADOWS.card,
  },
  mapBannerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  mapBannerIcon: {
    marginRight: 10,
  },
  mapBannerTextWrap: {
    flex: 1,
  },
  mapBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  mapBannerSubtitle: {
    fontSize: 11,
    color: COLORS.primaryDim,
    marginTop: 2,
  },
});
