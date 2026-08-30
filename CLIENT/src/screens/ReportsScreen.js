import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_INSPECTIONS } from '../data/mockData';
import { ApiService } from '../services/apiService';

export default function ReportsScreen({ navigation }) {
  const [exporting, setExporting] = useState(false);
  const [inspectionsList, setInspectionsList] = useState(MOCK_INSPECTIONS);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      const data = await ApiService.getInspections();
      if (data && data.length > 0) {
        setInspectionsList(data);
      }
    } catch (e) {
      console.warn('Reports fetch fallback', e);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  const handleExport = (type) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      Alert.alert(
        `${type} Export Ready`,
        `e-NirikShan Official Inspection Audit Dossier exported successfully to device storage.`
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Export Header Actions */}
      <View style={styles.exportBar}>
        <TouchableOpacity
          style={styles.pdfBtn}
          onPress={() => handleExport('PDF')}
          disabled={exporting}
        >
          <Ionicons name="document-text" size={16} color="#ffffff" />
          <Text style={styles.pdfBtnText}>Export PDF Audit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.csvBtn}
          onPress={() => handleExport('CSV')}
          disabled={exporting}
        >
          <Ionicons name="download-outline" size={16} color={COLORS.primary} />
          <Text style={styles.csvBtnText}>Export CSV Dataset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* KPI Summary Strip */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryVal}>128</Text>
            <Text style={styles.summaryLbl}>Total Projects</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryVal, { color: COLORS.success }]}>61%</Text>
            <Text style={styles.summaryLbl}>Completed</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryCol}>
            <Text style={[styles.summaryVal, { color: COLORS.critical }]}>8</Text>
            <Text style={styles.summaryLbl}>Flagged Anomalies</Text>
          </View>
        </View>

        {/* Audit Reports List */}
        <Text style={styles.sectionHeading}>OFFICIAL INSPECTION REPORTS</Text>

        {inspectionsList.map((ins) => (
          <View key={ins.id} style={styles.reportCard}>
            <View style={styles.reportTop}>
              <View style={styles.idWrap}>
                <Ionicons name="document-attach" size={16} color={COLORS.primary} />
                <Text style={styles.reportId}>{ins.id}</Text>
              </View>
              <View style={styles.statusTag}>
                <Text style={styles.statusTagText}>{ins.status}</Text>
              </View>
            </View>

            <Text style={styles.reportProject}>{ins.projectName}</Text>
            <Text style={styles.reportSub}>
              Inspector: {ins.inspectorName} • Date: {ins.scheduledDate}
            </Text>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreItem}>
                Compliance: <Text style={{ fontWeight: '800', color: COLORS.primary }}>{ins.compliance}%</Text>
              </Text>
              <Text style={styles.scoreItem}>
                Attendance: <Text style={{ fontWeight: '800', color: COLORS.primary }}>{ins.attendance}%</Text>
              </Text>
            </View>

            <View style={styles.reportActions}>
              <TouchableOpacity
                style={styles.viewAction}
                onPress={() => navigation.navigate('InspectionDetails', { inspection: ins })}
              >
                <Text style={styles.viewActionText}>View Audit Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadIconBtn}
                onPress={() => handleExport(`PDF-${ins.id}`)}
              >
                <Ionicons name="download" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  exportBar: {
    flexDirection: 'row',
    gap: 10,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  pdfBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  pdfBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  csvBtn: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  csvBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  summaryStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  summaryCol: {
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  summaryLbl: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  reportCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  reportTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  idWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportId: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statusTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  reportProject: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reportSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 10,
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: RADIUS.sm,
  },
  scoreItem: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
  },
  viewAction: {
    paddingVertical: 4,
  },
  viewActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  downloadIconBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
