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
import { MOCK_PROJECTS } from '../data/mockData';
import { ApiService } from '../services/apiService';

export default function CCTVScreen({ navigation }) {
  const [selectedCam, setSelectedCam] = useState('CAM-01');
  const [cctvList, setCctvList] = useState(MOCK_PROJECTS);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCCTV = useCallback(async () => {
    try {
      const projects = await ApiService.getProjects();
      if (projects && projects.length > 0) {
        setCctvList(projects);
      }
    } catch (e) {
      console.warn('CCTV fetch fallback', e);
    }
  }, []);

  useEffect(() => {
    fetchCCTV();
  }, [fetchCCTV]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCCTV();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* CCTV Security Header Strip */}
      <View style={styles.noticeStrip}>
        <Ionicons name="lock-closed" size={14} color={COLORS.primary} />
        <Text style={styles.noticeText}>
          Encrypted Central CCTV Monitoring Grid • RTSP / HLS Stream Protocol Ready
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {cctvList.map((proj) => {
          const isOnline = proj.cctvStatus === 'ONLINE';

          return (
            <View key={proj.id} style={styles.cameraCard}>
              {/* Camera Header */}
              <View style={styles.cameraHeader}>
                <View style={styles.camNameWrap}>
                  <Ionicons name="videocam" size={18} color={COLORS.primary} />
                  <Text style={styles.camIdText}>{proj.cctvCameraId} - {proj.name}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isOnline ? COLORS.successBg : COLORS.criticalBg },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isOnline ? COLORS.success : COLORS.critical },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: isOnline ? COLORS.successText : COLORS.criticalText },
                    ]}
                  >
                    {proj.cctvStatus}
                  </Text>
                </View>
              </View>

              {/* Video Stream Preview Frame */}
              <View style={styles.streamFrame}>
                {isOnline ? (
                  <View style={styles.onlineStreamBox}>
                    <View style={styles.liveTag}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>LIVE FEED (SECURE STREAM)</Text>
                    </View>
                    <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.timestampOverlay}>
                      28-May-2026 11:42:18 IST • 1080p 30fps
                    </Text>
                  </View>
                ) : (
                  <View style={styles.offlineStreamBox}>
                    <Ionicons name="cloud-offline" size={40} color={COLORS.critical} />
                    <Text style={styles.offlineText}>Camera Signal Offline</Text>
                    <Text style={styles.offlineSub}>
                      Last handshake received 4 hours ago. Alert dispatched to DCPU nodal officer.
                    </Text>
                  </View>
                )}
              </View>

              {/* Camera Metadata Details */}
              <View style={styles.cameraFooter}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>LOCATION</Text>
                  <Text style={styles.metaVal}>{proj.location}</Text>
                </View>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>BANDWIDTH</Text>
                  <Text style={styles.metaVal}>{isOnline ? '2.4 Mbps (H.265)' : '0 Kbps'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.inspectBtn}
                  onPress={() => navigation.navigate('ConductInspection', { project: proj })}
                >
                  <Text style={styles.inspectBtnText}>Audit</Text>
                </TouchableOpacity>
              </View>
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
  noticeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  noticeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: 14,
  },
  cameraCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  camNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  camIdText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  streamFrame: {
    height: 180,
    backgroundColor: '#1a1f1a',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineStreamBox: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#1f2d24',
  },
  liveTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.critical,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  timestampOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  offlineStreamBox: {
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  offlineText: {
    color: COLORS.critical,
    fontWeight: '800',
    fontSize: 14,
    marginTop: 4,
  },
  offlineSub: {
    color: '#9ca3af',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  cameraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  metaVal: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginTop: 1,
  },
  inspectBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  inspectBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
