import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../theme/theme';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate to Login after 2.2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Subtle Gradient Accents */}
      <View style={styles.topAccent} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Government Shield Emblem */}
        <View style={styles.emblemWrapper}>
          <Ionicons name="shield" size={54} color={COLORS.primary} />
          <View style={styles.emblemStar}>
            <Ionicons name="sparkles" size={14} color="#ffffff" />
          </View>
        </View>

        {/* Titles */}
        <Text style={styles.title}>e-NirikShan</Text>
        <Text style={styles.subtitle}>Monitoring & Inspection System</Text>
        
        <View style={styles.taglineBadge}>
          <Text style={styles.taglineText}>
            Real-Time Project Monitoring & Digital Inspection
          </Text>
        </View>

        {/* Loading Spinner */}
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Initializing secure environment...</Text>
        </View>
      </Animated.View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Government of India • Ministry of Social Justice & Empowerment
        </Text>
        <Text style={styles.subFooterText}>
          National Digital Governance & Transparency Infrastructure
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbf1',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  emblemWrapper: {
    width: 96,
    height: 96,
    borderRadius: RADIUS.full,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
    ...SHADOWS.card,
  },
  emblemStar: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  taglineBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryDim,
  },
  taglineText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 36,
  },
  loadingText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.sm,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  subFooterText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
