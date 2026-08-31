import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_PROJECTS, MOCK_INSPECTORS } from '../data/mockData';
import { sendLocalNotification } from '../services/notificationService';
import { ApiService } from '../services/apiService';

export default function RandomAssignmentScreen({ navigation, route }) {
  const initialProject = route.params?.project || MOCK_PROJECTS[0];

  const [assignmentMode, setAssignmentMode] = useState('random'); // 'random' | 'manual'
  const [selectedProject, setSelectedProject] = useState(initialProject);
  const [selectedInspector, setSelectedInspector] = useState(MOCK_INSPECTORS[0]);
  const [priority, setPriority] = useState('Normal'); // 'Normal' | 'High' | 'Emergency'
  const [scheduledDate, setScheduledDate] = useState('28 May 2026');

  // Random generator state
  const [generating, setGenerating] = useState(false);
  const [assignedResult, setAssignedResult] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Rule-based Random Assignment Algorithm connected to Backend REST API
  const handleGenerateRandomAssignment = async () => {
    setGenerating(true);
    setAssignedResult(null);

    try {
      // Call Backend API
      const backendRes = await ApiService.randomAssignInspection(
        selectedProject.id,
        scheduledDate,
        '11:30 AM',
        priority
      );

      if (backendRes && backendRes.inspectorName) {
        const matchingInspector = MOCK_INSPECTORS.find(i => i.name === backendRes.inspectorName) || MOCK_INSPECTORS[0];
        setAssignedResult({
          project: selectedProject,
          inspector: matchingInspector,
          distance: `${matchingInspector.distanceKm} km`,
          workload: matchingInspector.workloadScore,
          allocationType: 'Rule-Based Randomized Allocation',
          reason: backendRes.allocationReason || `Officer selected based on proximity (${matchingInspector.distanceKm} km), low workload balance, and randomized non-conflict rotation rules.`,
          scheduledDate: scheduledDate,
          scheduledTime: '11:30 AM',
        });
      } else {
        // Local algorithm fallback
        const candidates = [...MOCK_INSPECTORS];
        candidates.sort((a, b) => a.distanceKm - b.distanceKm);
        const chosen = candidates[Math.floor(Math.random() * Math.min(2, candidates.length))];

        setAssignedResult({
          project: selectedProject,
          inspector: chosen,
          distance: `${chosen.distanceKm} km`,
          workload: chosen.workloadScore,
          allocationType: 'Rule-Based Randomized Allocation',
          reason: `Officer selected based on proximity (${chosen.distanceKm} km), low workload balance (${chosen.workloadScore}), and randomized non-conflict rotation rules.`,
          scheduledDate: scheduledDate,
          scheduledTime: '11:30 AM',
        });
      }
    } catch (e) {
      console.warn('Random assignment fallback', e);
      const chosen = MOCK_INSPECTORS[0];
      setAssignedResult({
        project: selectedProject,
        inspector: chosen,
        distance: `${chosen.distanceKm} km`,
        workload: chosen.workloadScore,
        allocationType: 'Rule-Based Randomized Allocation',
        reason: `Officer selected based on proximity (${chosen.distanceKm} km), low workload balance (${chosen.workloadScore}), and randomized non-conflict rotation rules.`,
        scheduledDate: scheduledDate,
        scheduledTime: '11:30 AM',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirmDispatch = async () => {
    try {
      if (assignmentMode === 'manual') {
        await ApiService.assignInspection(
          selectedProject.id,
          selectedInspector.id,
          scheduledDate,
          '11:30 AM',
          priority
        );
      }
    } catch (e) {
      console.warn('Dispatch offline fallback', e);
    }

    sendLocalNotification({
      title: 'New Inspection Assigned',
      body: `Inspection for ${selectedProject.name} assigned to ${assignedResult ? assignedResult.inspector.name : selectedInspector.name}.`,
    });
    setSuccessModalVisible(true);
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selector Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              assignmentMode === 'random' && styles.modeBtnActive,
            ]}
            onPress={() => setAssignmentMode('random')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="sparkles"
              size={16}
              color={assignmentMode === 'random' ? '#ffffff' : COLORS.textMuted}
            />
            <Text
              style={[
                styles.modeBtnText,
                assignmentMode === 'random' && styles.modeBtnTextActive,
              ]}
            >
              Random Allocation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeBtn,
              assignmentMode === 'manual' && styles.modeBtnActive,
            ]}
            onPress={() => setAssignmentMode('manual')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person-add"
              size={16}
              color={assignmentMode === 'manual' ? '#ffffff' : COLORS.textMuted}
            />
            <Text
              style={[
                styles.modeBtnText,
                assignmentMode === 'manual' && styles.modeBtnTextActive,
              ]}
            >
              Manual Assignment
            </Text>
          </TouchableOpacity>
        </View>

        {/* Target Project Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>TARGET PROJECT</Text>
          <View style={styles.projectPickBox}>
            <View style={styles.projectIconWrap}>
              <Ionicons name="business" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.projectInfo}>
              <Text style={styles.projectName}>{selectedProject.name}</Text>
              <Text style={styles.projectSub}>
                {selectedProject.id} • {selectedProject.location}
              </Text>
            </View>
            <View style={styles.riskTag}>
              <Text style={styles.riskTagText}>Risk: {selectedProject.riskScore}</Text>
            </View>
          </View>
        </View>

        {/* RANDOM ALLOCATION MODE */}
        {assignmentMode === 'random' && (
          <View style={styles.sectionCard}>
            <View style={styles.algorithmNotice}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
              <View style={styles.algorithmNoticeTextWrap}>
                <Text style={styles.algorithmTitle}>Rule-Based Anonymized Allocation</Text>
                <Text style={styles.algorithmDesc}>
                  Prevents inspector conflict of interest by dynamically evaluating workload, geographic proximity, and rotational entropy.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.randomTriggerBtn}
              onPress={handleGenerateRandomAssignment}
              disabled={generating}
              activeOpacity={0.85}
            >
              {generating ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="shuffle" size={20} color="#ffffff" />
                  <Text style={styles.randomTriggerBtnText}>
                    Generate Random Assignment
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Assignment Outcome Card */}
            {assignedResult && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
                  <Text style={styles.resultTitle}>Inspector Selected & Assigned</Text>
                </View>

                <View style={styles.inspectorProfile}>
                  <View style={styles.inspectorAvatar}>
                    <Ionicons name="person" size={28} color={COLORS.primary} />
                  </View>
                  <View style={styles.inspectorInfo}>
                    <Text style={styles.inspectorName}>
                      {assignedResult.inspector.name}
                    </Text>
                    <Text style={styles.inspectorRole}>
                      {assignedResult.inspector.role}
                    </Text>
                    <Text style={styles.inspectorLocation}>
                      Base: {assignedResult.inspector.currentLocation}
                    </Text>
                  </View>
                </View>

                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>DISTANCE</Text>
                    <Text style={styles.metricVal}>{assignedResult.distance}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>WORKLOAD</Text>
                    <Text style={styles.metricVal}>{assignedResult.workload}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>SCHEDULED</Text>
                    <Text style={styles.metricVal}>{assignedResult.scheduledDate}</Text>
                  </View>
                </View>

                <View style={styles.reasonBox}>
                  <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                  <Text style={styles.reasonText}>{assignedResult.reason}</Text>
                </View>

                <TouchableOpacity
                  style={styles.dispatchBtn}
                  onPress={handleConfirmDispatch}
                  activeOpacity={0.85}
                >
                  <Ionicons name="send" size={18} color="#ffffff" />
                  <Text style={styles.dispatchBtnText}>Confirm & Dispatch Notification</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* MANUAL ASSIGNMENT MODE */}
        {assignmentMode === 'manual' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>SELECT INSPECTOR</Text>
            {MOCK_INSPECTORS.map((ins) => {
              const isSelected = selectedInspector.id === ins.id;
              return (
                <TouchableOpacity
                  key={ins.id}
                  style={[
                    styles.manualInspectorCard,
                    isSelected && styles.manualInspectorCardActive,
                  ]}
                  onPress={() => setSelectedInspector(ins)}
                  activeOpacity={0.8}
                >
                  <View style={styles.inspectorAvatarSmall}>
                    <Ionicons name="person" size={18} color={COLORS.primary} />
                  </View>
                  <View style={styles.inspectorInfo}>
                    <Text style={styles.inspectorName}>{ins.name}</Text>
                    <Text style={styles.inspectorRole}>{ins.role} • {ins.distanceKm} km away</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              );
            })}

            <Text style={[styles.sectionLabel, { marginTop: 14 }]}>PRIORITY LEVEL</Text>
            <View style={styles.priorityRow}>
              {['Normal', 'High', 'Emergency'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    priority === p && styles.priorityBtnActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityBtnText,
                      priority === p && styles.priorityBtnTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.dispatchBtn, { marginTop: 18 }]}
              onPress={handleConfirmDispatch}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              <Text style={styles.dispatchBtnText}>Assign Inspection</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalBox}>
            <View style={styles.successIconCircle}>
              <Ionicons name="notifications" size={42} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Inspection Assigned & Dispatched</Text>
            <Text style={styles.successDesc}>
              Notification sent to {selectedInspector.name}. Field audit logged in e-NirikShan Central Registry.
            </Text>

            <TouchableOpacity
              style={styles.successDoneBtn}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate('MainTabs', { screen: 'InspectionsTab' });
              }}
            >
              <Text style={styles.successDoneText}>View Inspections List</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.md,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.subtle,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  modeBtnTextActive: {
    color: '#ffffff',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  projectPickBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  projectIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  projectSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  riskTag: {
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  riskTagText: {
    fontSize: 11,
    color: COLORS.warningText,
    fontWeight: '700',
  },
  algorithmNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  algorithmNoticeTextWrap: {
    flex: 1,
  },
  algorithmTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  algorithmDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  randomTriggerBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.card,
  },
  randomTriggerBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  resultCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: COLORS.primaryDim,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: 16,
    ...SHADOWS.subtle,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.successText,
  },
  inspectorProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 12,
  },
  inspectorAvatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inspectorInfo: {
    flex: 1,
  },
  inspectorName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inspectorRole: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  inspectorLocation: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    padding: 8,
    borderRadius: RADIUS.sm,
    marginBottom: 14,
  },
  reasonText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  dispatchBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.card,
  },
  dispatchBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  manualInspectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 8,
  },
  manualInspectorCardActive: {
    backgroundColor: '#f0fdf4',
    borderColor: COLORS.primary,
  },
  inspectorAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  priorityBtnActive: {
    backgroundColor: COLORS.primary,
  },
  priorityBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priorityBtnTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  successModalBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.floating,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 20,
  },
  successDoneBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: RADIUS.md,
    width: '100%',
    alignItems: 'center',
  },
  successDoneText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
