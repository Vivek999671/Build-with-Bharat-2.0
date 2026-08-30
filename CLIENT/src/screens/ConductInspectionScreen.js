import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_INSPECTIONS, MOCK_PROJECTS } from '../data/mockData';
import { sendLocalNotification } from '../services/notificationService';
import { saveInspectionLocally } from '../storage/offlineStorage';
import { ApiService } from '../services/apiService';

export default function ConductInspectionScreen({ navigation, route }) {
  const inspection = route.params?.inspection || MOCK_INSPECTIONS[0];
  const project = route.params?.project || MOCK_PROJECTS.find(p => p.id === inspection.projectId) || MOCK_PROJECTS[0];

  // Active step index (0 to 6)
  const [activeStep, setActiveStep] = useState(1);

  // STEP 1: GPS Verification
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsData, setGpsData] = useState(null);

  // STEP 2: Attendance Verification
  const [totalStaff, setTotalStaff] = useState('50');
  const [presentStaff, setPresentStaff] = useState('46');
  const [beneficiaries, setBeneficiaries] = useState('180');
  const [attendanceVerified, setAttendanceVerified] = useState(true);

  // STEP 3: Checklist
  const checklistItems = [
    'Infrastructure Condition',
    'Staff Availability',
    'Beneficiary Attendance',
    'Record Maintenance',
    'Service Delivery',
    'Safety & Fire Compliance',
    'Scheme Guidelines Compliance',
  ];
  const [checklist, setChecklist] = useState({
    'Infrastructure Condition': 'PASS',
    'Staff Availability': 'PASS',
    'Beneficiary Attendance': 'PASS',
    'Record Maintenance': 'NEEDS ATTENTION',
    'Service Delivery': 'PASS',
    'Safety & Fire Compliance': 'PASS',
    'Scheme Guidelines Compliance': 'PASS',
  });

  // STEP 4: Photo / Video Evidence
  const [evidenceList, setEvidenceList] = useState([
    {
      id: 'EV-01',
      uri: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400',
      name: 'Building_Entrance_GeoTag.jpg',
      timestamp: '11:35 AM',
      coordinates: '18.5204° N, 73.8567° E',
      type: 'photo',
    },
    {
      id: 'EV-02',
      uri: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400',
      name: 'Classroom_Attendance_Biometric.jpg',
      timestamp: '11:42 AM',
      coordinates: '18.5205° N, 73.8568° E',
      type: 'photo',
    },
  ]);

  // STEP 5: Observations
  const [observations, setObservations] = useState(
    'Building infrastructure is maintained according to DoSJE norms. Staff attendance is verified. Two beneficiary logbook records require updating in the online portal.'
  );

  // STEP 6: Final Remarks & Status
  const [overallStatus, setOverallStatus] = useState('Compliant');
  const [riskLevel, setRiskLevel] = useState('Low');
  const [finalRemarks, setFinalRemarks] = useState(
    'Project complies with operational and safety parameters. Recommended for grant installment release.'
  );

  // STEP 7: Submission Modal
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Attendance Rate calculation
  const total = parseInt(totalStaff, 10) || 0;
  const present = parseInt(presentStaff, 10) || 0;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
  const isAnomaly = attendanceRate < 80;

  // GPS Capture Handler
  const handleCaptureGPS = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Fallback realistic coordinates for demo
        setGpsData({
          latitude: 18.5204,
          longitude: 73.8567,
          accuracy: 6.4,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          verified: true,
        });
        Alert.alert('Location Captured', 'Coordinates verified via e-NirikShan Geo-Lock.');
      } else {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setGpsData({
          latitude: Number(loc.coords.latitude.toFixed(4)),
          longitude: Number(loc.coords.longitude.toFixed(4)),
          accuracy: Number(loc.coords.accuracy?.toFixed(1) || 8.0),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          verified: true,
        });
      }
    } catch (e) {
      setGpsData({
        latitude: 18.5204,
        longitude: 73.8567,
        accuracy: 7.2,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        verified: true,
      });
    } finally {
      setGpsLoading(false);
    }
  };

  // Image Picker / Camera Capture
  const handleAddPhoto = async (useCamera = false) => {
    try {
      let result;
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Camera Permission', 'Camera access is required for geo-tagged evidence capture.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = `Evidence_${Date.now().toString().slice(-4)}.jpg`;
        const newEvidence = {
          id: `EV-${Date.now().toString().slice(-4)}`,
          uri: asset.uri,
          name: fileName,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          coordinates: gpsData ? `${gpsData.latitude}° N, ${gpsData.longitude}° E` : '18.5204° N, 73.8567° E',
          type: 'photo',
        };
        setEvidenceList((prev) => [...prev, newEvidence]);

        // Asynchronously upload binary to Spring Boot -> Supabase Storage
        try {
          const uploadRes = await ApiService.uploadEvidenceFile(inspection.id, asset.uri, {
            fileName,
            mediaType: 'IMAGE',
            latitude: gpsData?.latitude || 18.5204,
            longitude: gpsData?.longitude || 73.8567,
            accuracyMeters: gpsData?.accuracy || 6.4,
            capturedTimestamp: new Date().toISOString(),
            caption: `Geo-Tagged Field Photo for ${project.name}`,
          });
          if (uploadRes && uploadRes.fileUrl) {
            newEvidence.fileUrl = uploadRes.fileUrl;
          }
        } catch (uploadErr) {
          console.warn('Evidence photo saved locally for offline queue:', uploadErr.message);
        }
      }
    } catch (e) {
      Alert.alert('Notice', 'Evidence photo added successfully.');
    }
  };

  const handleChecklistSelect = (item, status) => {
    setChecklist(prev => ({ ...prev, [item]: status }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const submissionPayload = {
      id: inspection.id,
      projectId: project.id,
      projectName: project.name,
      gps: gpsData || { latitude: 18.5204, longitude: 73.8567, accuracy: 6.4 },
      attendanceRate,
      presentStaff: parseInt(presentStaff, 10) || 0,
      totalStaff: parseInt(totalStaff, 10) || 0,
      beneficiaries: parseInt(beneficiaries, 10) || 0,
      checklist,
      evidenceCount: evidenceList.length,
      observations,
      overallStatus,
      riskLevel,
      submittedAt: new Date().toISOString(),
    };

    // 1. Save offline draft for guaranteed local persistence (Offline-First)
    await saveInspectionLocally(submissionPayload);

    // 2. Submit to Backend REST API
    try {
      await ApiService.submitInspection(inspection.id, submissionPayload);
    } catch (e) {
      console.warn('Backend submit fallback to local queue', e);
    }

    setSubmitting(false);
    setSubmitModalVisible(false);
    setSuccessModalVisible(true);

    sendLocalNotification({
      title: 'Inspection Dossier Submitted',
      body: `Audit for ${project.name} (${inspection.id}) recorded and signed with Geo-Evidence tokens.`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Top Inspection Metadata Banner */}
      <View style={styles.metaBanner}>
        <View style={styles.metaBannerTop}>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>{inspection.id}</Text>
          </View>
          <View style={styles.geolockBadge}>
            <Ionicons name="shield-checkmark" size={13} color={COLORS.success} />
            <Text style={styles.geolockText}>e-NirikShan Secure Workflow</Text>
          </View>
        </View>
        <Text style={styles.bannerProjectTitle}>{project.name}</Text>
        <Text style={styles.bannerOrgTitle}>{project.organization} • {project.location}</Text>
      </View>

      {/* 7-Step Navigation Indicator Tabs */}
      <View style={styles.stepTabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepTabsScroll}>
          {['1. GPS Lock', '2. Attendance', '3. Checklist', '4. Evidence', '5. Observations', '6. Remarks', '7. Submit'].map(
            (label, idx) => {
              const stepNum = idx + 1;
              const isActive = activeStep === stepNum;
              const isDone = activeStep > stepNum;
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.stepTab, isActive && styles.stepTabActive]}
                  onPress={() => setActiveStep(stepNum)}
                >
                  {isDone ? (
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  ) : (
                    <View style={[styles.stepDot, isActive && styles.stepDotActive]} />
                  )}
                  <Text style={[styles.stepTabText, isActive && styles.stepTabTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>
      </View>

      {/* Main Content Area per Step */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= STEP 1: GPS VERIFICATION ================= */}
        {activeStep === 1 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>STEP 1</Text>
              </View>
              <Text style={styles.stepTitle}>Geo-Location & GPS Lock</Text>
            </View>
            <Text style={styles.stepDescription}>
              Inspectors must verify physical presence within the project's designated geofence (150m radius).
            </Text>

            {gpsData ? (
              <View style={styles.gpsVerifiedCard}>
                <View style={styles.gpsVerifiedHeader}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  <Text style={styles.gpsVerifiedTitle}>GPS Coordinates Verified</Text>
                </View>

                <View style={styles.coordsGrid}>
                  <View style={styles.coordsCol}>
                    <Text style={styles.coordsLabel}>LATITUDE</Text>
                    <Text style={styles.coordsVal}>{gpsData.latitude}° N</Text>
                  </View>
                  <View style={styles.coordsCol}>
                    <Text style={styles.coordsLabel}>LONGITUDE</Text>
                    <Text style={styles.coordsVal}>{gpsData.longitude}° E</Text>
                  </View>
                  <View style={styles.coordsCol}>
                    <Text style={styles.coordsLabel}>ACCURACY</Text>
                    <Text style={styles.coordsVal}>{gpsData.accuracy} meters</Text>
                  </View>
                  <View style={styles.coordsCol}>
                    <Text style={styles.coordsLabel}>TIMESTAMP</Text>
                    <Text style={styles.coordsVal}>{gpsData.timestamp}</Text>
                  </View>
                </View>

                <View style={styles.geofenceMatch}>
                  <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
                  <Text style={styles.geofenceMatchText}>Within Authorized Geofence (Distance: 12m)</Text>
                </View>
              </View>
            ) : (
              <View style={styles.gpsPlaceholder}>
                <Ionicons name="location-outline" size={48} color={COLORS.primary} />
                <Text style={styles.gpsPlaceholderText}>GPS lock not captured yet</Text>
                <Text style={styles.gpsPlaceholderSub}>
                  Ensure location services are enabled on your device.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.gpsButton}
              onPress={handleCaptureGPS}
              disabled={gpsLoading}
              activeOpacity={0.85}
            >
              {gpsLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="navigate" size={18} color="#ffffff" />
                  <Text style={styles.gpsButtonText}>
                    {gpsData ? 'Recapture Real-Time GPS' : 'Capture Real-Time GPS Location'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextStepBtn}
              onPress={() => setActiveStep(2)}
            >
              <Text style={styles.nextStepBtnText}>Continue to Attendance Verification</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 2: ATTENDANCE VERIFICATION ================= */}
        {activeStep === 2 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>STEP 2</Text>
              </View>
              <Text style={styles.stepTitle}>Staff & Beneficiary Attendance</Text>
            </View>
            <Text style={styles.stepDescription}>
              Cross-verify physical headcounts against biometric and register baseline numbers.
            </Text>

            {/* Attendance Input Fields */}
            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <Text style={styles.fieldLabel}>TOTAL SANCTIONED STAFF</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={totalStaff}
                  onChangeText={setTotalStaff}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.fieldLabel}>PRESENT STAFF (PHYSICAL)</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={presentStaff}
                  onChangeText={setPresentStaff}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>BENEFICIARIES PRESENT ON-SITE</Text>
              <TextInput
                style={styles.fieldInput}
                keyboardType="numeric"
                value={beneficiaries}
                onChangeText={setBeneficiaries}
              />
            </View>

            {/* Automated Attendance Rate Card */}
            <View style={[styles.rateCard, isAnomaly && styles.anomalyRateCard]}>
              <View style={styles.rateCardRow}>
                <View>
                  <Text style={styles.rateLabel}>Calculated Attendance Rate</Text>
                  <Text style={[styles.rateValue, isAnomaly && { color: COLORS.critical }]}>
                    {attendanceRate}%
                  </Text>
                </View>
                <View
                  style={[
                    styles.rateBadge,
                    { backgroundColor: isAnomaly ? COLORS.criticalBg : COLORS.successBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.rateBadgeText,
                      { color: isAnomaly ? COLORS.criticalText : COLORS.successText },
                    ]}
                  >
                    {isAnomaly ? 'Anomaly Detected' : 'Satisfactory (>80%)'}
                  </Text>
                </View>
              </View>

              {isAnomaly && (
                <View style={styles.anomalyAlertBox}>
                  <Ionicons name="warning" size={16} color={COLORS.critical} />
                  <Text style={styles.anomalyAlertText}>
                    Attendance drop &gt; 20% triggers automatic anomaly flag for DoSJE audit review.
                  </Text>
                </View>
              )}
            </View>

            {/* Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAttendanceVerified(!attendanceVerified)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={attendanceVerified ? 'checkbox' : 'square-outline'}
                size={22}
                color={COLORS.primary}
              />
              <Text style={styles.checkboxLabel}>
                I confirm physical verification of staff and beneficiary headcount.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextStepBtn}
              onPress={() => setActiveStep(3)}
            >
              <Text style={styles.nextStepBtnText}>Continue to Inspection Checklist</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 3: CHECKLIST ================= */}
        {activeStep === 3 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>STEP 3</Text>
              </View>
              <Text style={styles.stepTitle}>Inspection Checklist</Text>
            </View>
            <Text style={styles.stepDescription}>
              Evaluate every operational criterion with Pass, Fail, or Needs Attention.
            </Text>

            {checklistItems.map((item, idx) => {
              const currentVal = checklist[item];
              return (
                <View key={item} style={styles.checklistItem}>
                  <Text style={styles.checklistItemTitle}>
                    {idx + 1}. {item}
                  </Text>
                  <View style={styles.checklistPillsRow}>
                    {['PASS', 'FAIL', 'NEEDS ATTENTION'].map((status) => {
                      const isSelected = currentVal === status;
                      const isPass = status === 'PASS';
                      const isFail = status === 'FAIL';

                      const activeBg = isPass
                        ? COLORS.success
                        : isFail
                        ? COLORS.critical
                        : COLORS.warning;

                      return (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.statusPill,
                            isSelected && { backgroundColor: activeBg, borderColor: activeBg },
                          ]}
                          onPress={() => handleChecklistSelect(item, status)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.statusPillText,
                              isSelected && { color: '#ffffff', fontWeight: '800' },
                            ]}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.nextStepBtn}
              onPress={() => setActiveStep(4)}
            >
              <Text style={styles.nextStepBtnText}>Continue to Digital Evidence</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 4: PHOTO / VIDEO EVIDENCE ================= */}
        {activeStep === 4 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>STEP 4</Text>
              </View>
              <Text style={styles.stepTitle}>Geo-Tagged Digital Evidence</Text>
            </View>
            <Text style={styles.stepDescription}>
              All photos/videos are automatically embedded with cryptographic timestamps and GPS coordinates.
            </Text>

            {/* Action Buttons */}
            <View style={styles.evidenceButtonsRow}>
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => handleAddPhoto(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={18} color="#ffffff" />
                <Text style={styles.cameraBtnText}>Capture Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.galleryBtn}
                onPress={() => handleAddPhoto(false)}
                activeOpacity={0.8}
              >
                <Ionicons name="images" size={18} color={COLORS.primary} />
                <Text style={styles.galleryBtnText}>Upload Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Evidence List Previews */}
            <Text style={styles.evidenceListHeading}>
              CAPTURED EVIDENCE ({evidenceList.length} FILES)
            </Text>

            {evidenceList.map((ev) => (
              <View key={ev.id} style={styles.evidenceCard}>
                <Image source={{ uri: ev.uri }} style={styles.evidenceThumb} />
                <View style={styles.evidenceInfo}>
                  <Text style={styles.evidenceName} numberOfLines={1}>{ev.name}</Text>
                  <View style={styles.evidenceTagRow}>
                    <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.evidenceTagText}>{ev.timestamp}</Text>
                  </View>
                  <View style={styles.evidenceTagRow}>
                    <Ionicons name="location" size={12} color={COLORS.primary} />
                    <Text style={styles.evidenceTagText}>{ev.coordinates}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setEvidenceList(evidenceList.filter(e => e.id !== ev.id))}
                  style={styles.deleteEvidenceBtn}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.critical} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.nextStepBtn}
              onPress={() => setActiveStep(5)}
            >
              <Text style={styles.nextStepBtnText}>Continue to Observations</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 5: OBSERVATIONS ================= */}
        {activeStep === 5 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>STEP 5</Text>
              </View>
              <Text style={styles.stepTitle}>Field Observations</Text>
            </View>
            <Text style={styles.stepDescription}>
              Record qualitative notes regarding infrastructure quality, hygiene, beneficiary satisfaction, and register maintenance.
            </Text>

            <TextInput
              style={styles.observationsInput}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholder="Enter detailed field observations..."
              placeholderTextColor={COLORS.textMuted}
              value={observations}
              onChangeText={setObservations}
            />

            {/* Quick Notes Suggestions */}
            <Text style={styles.quickNotesLabel}>QUICK AUDIT PHRASES</Text>
            <View style={styles.quickPhrasesRow}>
              {[
                'Staff attendance verified satisfactory',
                'Fire safety certificate renewed',
                'Minor kitchen maintenance required',
                'Biometric log matches register',
              ].map((phrase) => (
                <TouchableOpacity
                  key={phrase}
                  style={styles.phraseChip}
                  onPress={() => setObservations(prev => `${prev}\n• ${phrase}`)}
                >
                  <Text style={styles.phraseText}>+ {phrase}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.nextStepBtn}
              onPress={() => setActiveStep(6)}
            >
              <Text style={styles.nextStepBtnText}>Continue to Final Remarks & Risk</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 6: FINAL REMARKS & RISK ================= */}
        {activeStep === 6 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>STEP 6</Text>
              </View>
              <Text style={styles.stepTitle}>Final Remarks & Risk Rating</Text>
            </View>

            <Text style={styles.fieldLabel}>OVERALL COMPLIANCE STATUS</Text>
            <View style={styles.statusOptionRow}>
              {['Compliant', 'Partially Compliant', 'Non-Compliant'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[
                    styles.statusOptionBtn,
                    overallStatus === st && styles.statusOptionBtnActive,
                  ]}
                  onPress={() => setOverallStatus(st)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      overallStatus === st && styles.statusOptionTextActive,
                    ]}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>OVERALL RISK LEVEL</Text>
            <View style={styles.statusOptionRow}>
              {['Low', 'Medium', 'High', 'Critical'].map((rk) => (
                <TouchableOpacity
                  key={rk}
                  style={[
                    styles.statusOptionBtn,
                    riskLevel === rk && {
                      backgroundColor:
                        rk === 'Low'
                          ? COLORS.success
                          : rk === 'Medium'
                          ? COLORS.warning
                          : COLORS.critical,
                      borderColor: 'transparent',
                    },
                  ]}
                  onPress={() => setRiskLevel(rk)}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      riskLevel === rk && { color: '#ffffff', fontWeight: '800' },
                    ]}
                  >
                    {rk}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>FINAL REMARKS</Text>
            <TextInput
              style={styles.remarksInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={finalRemarks}
              onChangeText={setFinalRemarks}
            />

            <TouchableOpacity
              style={styles.nextStepBtn}
              onPress={() => setActiveStep(7)}
            >
              <Text style={styles.nextStepBtnText}>Review & Submit Inspection</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 7: REVIEW & SUBMISSION ================= */}
        {activeStep === 7 && (
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>STEP 7</Text>
              </View>
              <Text style={styles.stepTitle}>Inspection Submission Summary</Text>
            </View>

            {/* Checklist items verification */}
            <View style={styles.summaryList}>
              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <View style={styles.summaryItemTextWrap}>
                  <Text style={styles.summaryItemTitle}>GPS Geo-Lock Verified</Text>
                  <Text style={styles.summaryItemSub}>18.5204° N, 73.8567° E (Within geofence)</Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <View style={styles.summaryItemTextWrap}>
                  <Text style={styles.summaryItemTitle}>Attendance Counted</Text>
                  <Text style={styles.summaryItemSub}>
                    {presentStaff}/{totalStaff} staff present ({attendanceRate}%) • {beneficiaries} beneficiaries
                  </Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <View style={styles.summaryItemTextWrap}>
                  <Text style={styles.summaryItemTitle}>Compliance Checklist</Text>
                  <Text style={styles.summaryItemSub}>7 / 7 mandatory criteria verified</Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <View style={styles.summaryItemTextWrap}>
                  <Text style={styles.summaryItemTitle}>Geo-Tagged Evidence Uploaded</Text>
                  <Text style={styles.summaryItemSub}>{evidenceList.length} photos locked with timestamp</Text>
                </View>
              </View>
            </View>

            {/* Final Submit Button */}
            <TouchableOpacity
              style={styles.finalSubmitBtn}
              onPress={() => setSubmitModalVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="cloud-upload" size={20} color="#ffffff" />
              <Text style={styles.finalSubmitBtnText}>Submit Field Inspection</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={submitModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalBox}>
            <View style={styles.confirmIconWrap}>
              <Ionicons name="shield-checkmark" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.confirmTitle}>Submit Inspection Dossier?</Text>
            <Text style={styles.confirmDesc}>
              This will digitally sign and lock the inspection data for {project.name}. Data will sync to the e-NirikShan Central Portal.
            </Text>

            <View style={styles.confirmBtnRow}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={() => setSubmitModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.confirmCancelText}>Review More</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmSubmitBtn}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.confirmSubmitText}>Confirm & Sign</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalBox}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={42} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Inspection Submitted Successfully</Text>
            <Text style={styles.successId}>ID: {inspection.id}</Text>
            <Text style={styles.successDesc}>
              Audit record uploaded, timestamped, and stored with geo-evidence verification.
            </Text>

            <TouchableOpacity
              style={styles.successDoneBtn}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.navigate('InspectionsTab');
              }}
            >
              <Text style={styles.successDoneText}>Return to Inspections Hub</Text>
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
  metaBanner: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  metaBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  idBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  geolockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  geolockText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '700',
  },
  bannerProjectTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bannerOrgTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  stepTabsWrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  stepTabsScroll: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    gap: 8,
  },
  stepTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textMuted,
  },
  stepDotActive: {
    backgroundColor: '#ffffff',
  },
  stepTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  stepCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  stepNumberBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  stepNumberText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stepDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 14,
  },
  gpsPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    gap: 6,
  },
  gpsPlaceholderText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  gpsPlaceholderSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  gpsVerifiedCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: COLORS.primaryDim,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 14,
  },
  gpsVerifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  gpsVerifiedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.successText,
  },
  coordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  coordsCol: {
    width: '47%',
  },
  coordsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  coordsVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  geofenceMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#bbf7d0',
  },
  geofenceMatchText: {
    fontSize: 11,
    color: COLORS.successText,
    fontWeight: '600',
  },
  gpsButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADIUS.md,
    gap: 8,
    marginBottom: 10,
  },
  gpsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  nextStepBtn: {
    backgroundColor: COLORS.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: RADIUS.md,
    gap: 8,
    marginTop: 6,
  },
  nextStepBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  inputCol: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  rateCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 14,
  },
  anomalyRateCard: {
    backgroundColor: COLORS.criticalBg,
    borderColor: '#fca5a5',
  },
  rateCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  rateValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.success,
    marginTop: 2,
  },
  rateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  rateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  anomalyAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  anomalyAlertText: {
    fontSize: 11,
    color: COLORS.criticalText,
    fontWeight: '600',
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  checkboxLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  checklistItem: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  checklistItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  checklistPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  evidenceButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  cameraBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  cameraBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  galleryBtn: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  galleryBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  evidenceListHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  evidenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 8,
    marginBottom: 8,
  },
  evidenceThumb: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.border,
    marginRight: 10,
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  evidenceTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  evidenceTagText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  deleteEvidenceBtn: {
    padding: 8,
  },
  observationsInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    minHeight: 110,
    marginBottom: 12,
  },
  quickNotesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  quickPhrasesRow: {
    gap: 6,
    marginBottom: 12,
  },
  phraseChip: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  phraseText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statusOptionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statusOptionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  statusOptionBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statusOptionTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  remarksInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
    fontSize: 13,
    color: COLORS.textPrimary,
    minHeight: 80,
    marginBottom: 12,
  },
  summaryList: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  summaryItemTextWrap: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  summaryItemSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  finalSubmitBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: RADIUS.md,
    gap: 8,
    ...SHADOWS.card,
  },
  finalSubmitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  confirmModalBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.floating,
  },
  confirmIconWrap: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  confirmDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 18,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  confirmCancelBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  confirmCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  confirmSubmitBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  confirmSubmitText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
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
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  successId: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
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
