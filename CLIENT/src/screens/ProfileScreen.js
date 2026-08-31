import React, { useState, useEffect } from 'react';
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
import { getSavedUser, setAuthToken, setSavedUser } from '../services/apiService';

export default function ProfileScreen({ navigation, route }) {
  const [currentUser, setCurrentUser] = useState(route.params?.user || null);

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        const saved = await getSavedUser();
        if (saved) setCurrentUser(saved);
      }
    })();
  }, [currentUser]);

  const departmentName = currentUser?.department || route.params?.department || 'Department of Social Justice and Empowerment';
  const officerName = currentUser?.fullName || 'Rahul Sharma';
  const officialId = currentUser?.officialId || 'DSJE-OFF-2026';
  const userRole = currentUser?.designation || route.params?.userRole || 'Field Inspection Officer';
  const districtName = currentUser?.district || 'Pune';
  const stateName = currentUser?.state || 'MH';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Officer Profile</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => Alert.alert('Settings', 'e-NirikShan v1.0.0 (Production Build - Gov of India)')}
        >
          <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Ionicons name="person" size={42} color={COLORS.primary} />
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.officerName}>{officerName}</Text>
          <Text style={styles.officerRole}>{userRole} (ID: {officialId})</Text>

          <View style={styles.deptBadge}>
            <Ionicons name="business" size={13} color={COLORS.primary} />
            <Text style={styles.deptBadgeText} numberOfLines={2}>
              {departmentName}
            </Text>
          </View>

          <View style={styles.quickInfoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>DISTRICT</Text>
              <Text style={styles.infoVal}>{districtName}, {stateName}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>SECURITY CLEARANCE</Text>
              <Text style={[styles.infoVal, { color: COLORS.success }]}>Level 3 (Gov)</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>AUDITS THIS MONTH</Text>
              <Text style={styles.infoVal}>14 Filed</Text>
            </View>
          </View>
        </View>

        {/* Section List */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('MainTabs', { screen: 'InspectionsTab' })}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="clipboard" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>My Active Field Assignments</Text>
              <Text style={styles.menuSubtitle}>2 Inspections pending field visit</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Reports')}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: COLORS.infoBg }]}>
              <Ionicons name="document-text" size={18} color={COLORS.info} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Historical Audit Dossiers</Text>
              <Text style={styles.menuSubtitle}>Export and download completed PDFs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('RiskAnalytics')}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: COLORS.criticalBg }]}>
              <Ionicons name="analytics" size={18} color={COLORS.critical} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Risk Analytics Dashboard</Text>
              <Text style={styles.menuSubtitle}>Rule-based anomaly scorecards</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* System & Support */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'Offline Sync Status',
                'e-NirikShan Local Storage: 0 pending offline audits. Cloud synchronization is Active.'
              )
            }
          >
            <View style={[styles.menuIconWrap, { backgroundColor: COLORS.successBg }]}>
              <Ionicons name="cloud-done" size={18} color={COLORS.success} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Cloud Synchronization</Text>
              <Text style={styles.menuSubtitle}>Offline-First Local Storage Active</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert('Log Out', 'Are you sure you want to end your current e-NirikShan session?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                  await setAuthToken(null);
                  await setSavedUser(null);
                  navigation.replace('Login');
                },
              },
            ]);
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color={COLORS.critical} />
          <Text style={styles.logoutText}>Log Out from e-NirikShan</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  avatarWrap: {
    width: 78,
    height: 78,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  onlineBadge: {
    width: 14,
    height: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: '#ffffff',
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  officerName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  officerRole: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  deptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginTop: 10,
    maxWidth: '90%',
  },
  deptBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  quickInfoGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    alignItems: 'center',
    flex: 1,
  },
  infoDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.md,
    ...SHADOWS.subtle,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginLeft: 62,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.criticalBg,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  logoutText: {
    color: COLORS.criticalText,
    fontWeight: '800',
    fontSize: 14,
  },
});
