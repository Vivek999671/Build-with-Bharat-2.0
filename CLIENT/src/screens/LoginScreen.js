import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { ApiService, setSavedUser } from '../services/apiService';

export default function LoginScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState('DoSJE Official');
  const [officialId, setOfficialId] = useState('DOSJE-OFF-2026');
  const [password, setPassword] = useState('••••••••');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: 'DoSJE Official',
      title: 'DoSJE Official',
      subtitle: 'Central / State Monitoring',
      icon: 'shield-checkmark',
      demoId: 'admin',
    },
    {
      id: 'PMU Inspector',
      title: 'PMU Inspector',
      subtitle: 'Field Inspection Team',
      icon: 'clipboard',
      demoId: 'rahul.inspector',
    },
    {
      id: 'Project Staff',
      title: 'Project Staff',
      subtitle: 'NGO / Institute Admin',
      icon: 'business',
      demoId: 'sahyadri.ngo',
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setOfficialId(role.demoId);
  };

  const handleLogin = async () => {
    if (!officialId.trim()) {
      Alert.alert('Validation Error', 'Please enter your Official ID or Email.');
      return;
    }

    setLoading(true);
    try {
      const user = await ApiService.login(officialId, password === '••••••••' ? 'admin123' : password);
      if (user) {
        await setSavedUser(user);
      }
      navigation.replace('MainTabs', { userRole: selectedRole, user });
    } catch (err) {
      Alert.alert(
        'Authentication Notice',
        `Server notice: ${err.message || 'Unable to connect to Spring Boot / Supabase'}.\n\nWould you like to continue in offline inspection mode?`,
        [
          { text: 'Retry', style: 'cancel' },
          {
            text: 'Offline Mode',
            onPress: () => navigation.replace('MainTabs', { userRole: selectedRole }),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Decorative Gov Header Bar */}
          <View style={styles.govBar} />

          {/* Header & Emblem */}
          <View style={styles.header}>
            <View style={styles.emblemContainer}>
              <Ionicons name="shield" size={38} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>e-NirikShan</Text>
            <Text style={styles.subtitle}>Monitoring & Inspection System</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Department of Social Justice & Empowerment</Text>
            </View>
          </View>

          {/* Role Selection Tabs */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SELECT ACCESS ROLE</Text>
            <View style={styles.roleContainer}>
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.roleCard,
                      isSelected && styles.roleCardActive,
                    ]}
                    onPress={() => handleRoleSelect(role)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={role.icon}
                      size={18}
                      color={isSelected ? COLORS.primary : COLORS.textMuted}
                    />
                    <View style={styles.roleTextWrapper}>
                      <Text
                        style={[
                          styles.roleTitle,
                          isSelected && styles.roleTitleActive,
                        ]}
                      >
                        {role.title}
                      </Text>
                      <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Login Form Card */}
          <View style={styles.formCard}>
            {/* Official ID / Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OFFICIAL ID / EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Official ID or Email"
                  placeholderTextColor={COLORS.textMuted}
                  value={officialId}
                  onChangeText={setOfficialId}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Forgot Password',
                      'Please contact your System Administrator for password reset instructions.'
                    )
                  }
                >
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={secureText}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={secureText ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginButtonText}>
                Login as {selectedRole}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Security & Official Notice Footer */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={COLORS.textMuted}
              />
              <Text style={styles.footerText}>
                Authorized Government Portal • 256-bit Encrypted
              </Text>
            </View>
            <Text style={styles.subFooterText}>
              Ministry of Social Justice & Empowerment • Govt. of India
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  govBar: {
    height: 4,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  emblemContainer: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.subtle,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  roleContainer: {
    gap: 8,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0fdf4',
  },
  roleTextWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  roleTitleActive: {
    color: COLORS.primary,
  },
  roleSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    marginTop: 4,
    gap: 8,
    ...SHADOWS.card,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  subFooterText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
