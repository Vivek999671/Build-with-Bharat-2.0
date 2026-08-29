import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_ALERTS } from '../data/mockData';

export default function AlertsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('All');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const tabs = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredAlerts = alerts.filter((alt) => {
    if (selectedTab === 'All') return true;
    return alt.type.toLowerCase() === selectedTab.toLowerCase();
  });

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
    Alert.alert('Alerts Updated', 'All notification alerts marked as read.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Alerts & Anomalies</Text>
          <Text style={styles.headerSubtitle}>Real-Time Rule-Based Anomaly Triggers</Text>
        </View>
        <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
          <Ionicons name="checkmark-done" size={16} color={COLORS.primary} />
          <Text style={styles.markReadText}>Mark Read</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.tabList}
          renderItem={({ item }) => {
            const isSelected = selectedTab === item;
            return (
              <TouchableOpacity
                style={[styles.tabItem, isSelected && styles.tabItemActive]}
                onPress={() => setSelectedTab(item)}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isCrit = item.type === 'CRITICAL';
          const isHigh = item.type === 'HIGH';

          const iconColor = isCrit
            ? COLORS.critical
            : isHigh
            ? COLORS.warning
            : COLORS.info;

          const iconBg = isCrit
            ? COLORS.criticalBg
            : isHigh
            ? COLORS.warningBg
            : COLORS.infoBg;

          return (
            <TouchableOpacity
              style={[
                styles.alertCard,
                isCrit && styles.criticalCard,
                !item.read && styles.unreadCard,
              ]}
              onPress={() =>
                Alert.alert(
                  item.title,
                  `${item.description}\n\nProject: ${item.projectName}\nRisk Score: ${item.riskScore}/100`,
                  [
                    { text: 'Dismiss', style: 'cancel' },
                    {
                      text: 'Conduct Inspection',
                      onPress: () => navigation.navigate('ConductInspection'),
                    },
                  ]
                )
              }
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                <Ionicons
                  name={isCrit ? 'alert-circle' : isHigh ? 'warning' : 'information-circle'}
                  size={22}
                  color={iconColor}
                />
              </View>

              <View style={styles.alertBody}>
                <View style={styles.alertTopRow}>
                  <View style={[styles.typeBadge, { backgroundColor: iconBg }]}>
                    <Text style={[styles.typeText, { color: iconColor }]}>
                      {item.type}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>{item.timestamp}</Text>
                </View>

                <Text style={styles.alertTitle}>{item.title}</Text>
                <Text style={styles.projectText}>{item.projectName}</Text>
                <Text style={styles.descText}>{item.description}</Text>

                <View style={styles.alertFooter}>
                  <Text style={styles.riskScoreText}>
                    Risk Impact: <Text style={{ color: iconColor, fontWeight: '800' }}>{item.riskScore}/100</Text>
                  </Text>
                  <View style={styles.actionPrompt}>
                    <Text style={styles.actionPromptText}>Tap for action</Text>
                    <Ionicons name="chevron-forward" size={12} color={COLORS.primary} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tabSection: {
    backgroundColor: COLORS.surface,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tabList: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: 8,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: 12,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  criticalCard: {
    borderColor: '#fca5a5',
    backgroundColor: '#fffcfc',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.critical,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertBody: {
    flex: 1,
  },
  alertTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  projectText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 1,
  },
  descText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginTop: 4,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  riskScoreText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  actionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionPromptText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
