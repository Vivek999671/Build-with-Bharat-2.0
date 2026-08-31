import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_PROJECTS } from '../data/mockData';
import { detectAnomalies } from '../utils/anomalyDetection';
import { ApiService } from '../services/apiService';

export default function RiskAnalyticsScreen({ navigation }) {
  const [projectsList, setProjectsList] = useState(MOCK_PROJECTS);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRiskData = useCallback(async () => {
    try {
      const data = await ApiService.getProjects();
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    } catch (e) {
      console.warn('Risk data fetch fallback', e);
    }
  }, []);

  useEffect(() => {
    fetchRiskData();
  }, [fetchRiskData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRiskData();
    setRefreshing(false);
  };

  const highRiskProjects = projectsList.filter((p) => (p.riskScore || 0) >= 60);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Risk Algorithm Card */}
        <View style={styles.engineCard}>
          <View style={styles.engineHeader}>
            <Ionicons name="hardware-chip" size={22} color={COLORS.primary} />
            <Text style={styles.engineTitle}>Rule-Based Anomaly Detection Engine</Text>
          </View>
          <Text style={styles.engineDesc}>
            Automated compliance engine evaluates biometric attendance drops &gt; 20%, inspection overdue intervals, and CCTV connectivity dropouts.
          </Text>

          <View style={styles.rulesGrid}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleCondition}>Attendance &lt; 80%</Text>
              <Text style={styles.ruleResult}>+40 Risk Score (Critical Flag)</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleCondition}>Overdue &gt; 3 Days</Text>
              <Text style={styles.ruleResult}>+20 Risk Score (Schedule Alert)</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleCondition}>CCTV Signal Loss</Text>
              <Text style={styles.ruleResult}>+15 Risk Score (Infrastructure Flag)</Text>
            </View>
          </View>
        </View>

        {/* Flagged High Risk Projects */}
        <Text style={styles.sectionHeading}>FLAGGED HIGH-RISK INSTITUTES ({highRiskProjects.length})</Text>

        {highRiskProjects.map((proj) => {
          const anomalies = detectAnomalies(proj);

          return (
            <View key={proj.id} style={styles.flaggedCard}>
              <View style={styles.flaggedTop}>
                <View>
                  <Text style={styles.flaggedTitle}>{proj.name}</Text>
                  <Text style={styles.flaggedOrg}>{proj.organization} • {proj.location}</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{proj.riskScore}/100</Text>
                </View>
              </View>

              {/* Anomaly Factors */}
              <View style={styles.anomaliesList}>
                {anomalies.map((anom) => (
                  <View key={anom.id} style={styles.anomRow}>
                    <Ionicons
                      name={anom.level === 'CRITICAL' ? 'alert-circle' : 'warning'}
                      size={16}
                      color={anom.level === 'CRITICAL' ? COLORS.critical : COLORS.warning}
                    />
                    <Text style={styles.anomReason}>{anom.reason}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.inspectBtn}
                onPress={() => navigation.navigate('ConductInspection', { project: proj })}
              >
                <Ionicons name="play" size={14} color="#ffffff" />
                <Text style={styles.inspectBtnText}>Trigger Immediate Inspection</Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
  engineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  engineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  engineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  engineDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  rulesGrid: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 10,
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleCondition: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ruleResult: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.critical,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginVertical: 8,
  },
  flaggedCard: {
    backgroundColor: '#fffdfd',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: 12,
    ...SHADOWS.subtle,
  },
  flaggedTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  flaggedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  flaggedOrg: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: COLORS.critical,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  anomaliesList: {
    backgroundColor: COLORS.criticalBg,
    borderRadius: RADIUS.sm,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  anomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  anomReason: {
    fontSize: 11,
    color: COLORS.criticalText,
    fontWeight: '600',
    flex: 1,
  },
  inspectBtn: {
    backgroundColor: COLORS.critical,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  inspectBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
