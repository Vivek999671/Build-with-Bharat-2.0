import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, RADIUS } from '../theme/theme';
import { MOCK_INSPECTIONS } from '../data/mockData';
import { ApiService } from '../services/apiService';

export default function InspectionsScreen({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [inspectionsList, setInspectionsList] = useState(MOCK_INSPECTIONS);
  const [refreshing, setRefreshing] = useState(false);

  const tabs = ['All', 'Assigned', 'In Progress', 'Completed', 'Flagged', 'Pending'];

  const fetchInspections = useCallback(async () => {
    try {
      const data = await ApiService.getInspections(selectedTab);
      if (data && data.length > 0) {
        setInspectionsList(data);
      }
    } catch (e) {
      console.warn('Inspections fetch fallback', e);
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInspections();
    setRefreshing(false);
  };

  const filteredInspections = inspectionsList.filter((ins) => {
    const matchesSearch =
      (ins.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ins.projectName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ins.inspectorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ins.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTab === 'All') return true;
    return (ins.status || '').toLowerCase() === selectedTab.toLowerCase();
  });

  const renderInspectionCard = ({ item }) => {
    const isCompleted = item.status === 'Completed';
    const isFlagged = item.status === 'Flagged';
    const isAssigned = item.status === 'Assigned';

    const statusBg = isCompleted
      ? COLORS.successBg
      : isFlagged
      ? COLORS.criticalBg
      : COLORS.infoBg;

    const statusText = isCompleted
      ? COLORS.successText
      : isFlagged
      ? COLORS.criticalText
      : COLORS.infoText;

    const isHighRisk = item.riskLevel === 'Critical' || item.riskLevel === 'High';

    return (
      <TouchableOpacity
        style={[styles.card, isFlagged && styles.flaggedCard]}
        onPress={() => navigation.navigate('InspectionDetails', { inspection: item })}
        activeOpacity={0.85}
      >
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.idBadge}>
            <Ionicons name="clipboard-outline" size={13} color={COLORS.primary} />
            <Text style={styles.idText}>{item.id}</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusBadgeText, { color: statusText }]}>
                {item.status}
              </Text>
            </View>

            <View
              style={[
                styles.riskBadge,
                { backgroundColor: isHighRisk ? COLORS.criticalBg : COLORS.successBg },
              ]}
            >
              <Text
                style={[
                  styles.riskBadgeText,
                  { color: isHighRisk ? COLORS.criticalText : COLORS.successText },
                ]}
              >
                {item.riskLevel} Risk
              </Text>
            </View>
          </View>
        </View>

        {/* Project Name & Org */}
        <Text style={styles.projectName}>{item.projectName}</Text>
        <Text style={styles.orgName}>{item.organization}</Text>

        {/* Inspector Name & Role */}
        <View style={styles.inspectorRow}>
          <View style={styles.avatarIcon}>
            <Ionicons name="person" size={12} color={COLORS.primary} />
          </View>
          <View style={styles.inspectorInfo}>
            <Text style={styles.inspectorName}>Inspector: {item.inspectorName}</Text>
            <Text style={styles.inspectorRole}>{item.inspectorRole}</Text>
          </View>
        </View>

        {/* Date, Time & Distance */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{item.scheduledDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{item.scheduledTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={13} color={COLORS.primary} />
            <Text style={[styles.metaText, { color: COLORS.primary, fontWeight: '700' }]}>
              {item.distance}
            </Text>
          </View>
        </View>

        {/* Card Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => navigation.navigate('InspectionDetails', { inspection: item })}
          >
            <Text style={styles.viewBtnText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {!isCompleted && (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('ConductInspection', { inspection: item })}
            >
              <Ionicons name="play" size={13} color="#ffffff" />
              <Text style={styles.startBtnText}>Start Field Inspection</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inspections Hub</Text>
          <Text style={styles.headerSubtitle}>Field Audits & Compliance Tracking</Text>
        </View>
        <TouchableOpacity
          style={styles.assignBtn}
          onPress={() => navigation.navigate('RandomAssignment')}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={16} color="#ffffff" />
          <Text style={styles.assignBtnText}>Assign</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, project name, inspector..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
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
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Inspections List */}
      <FlatList
        data={filteredInspections}
        keyExtractor={(item) => item.id}
        renderItem={renderInspectionCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Inspections Found</Text>
            <Text style={styles.emptySubtitle}>
              Try switching tabs or resetting your search query
            </Text>
          </View>
        }
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
  assignBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
    ...SHADOWS.subtle,
  },
  assignBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
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
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  flaggedCard: {
    borderColor: '#fca5a5',
    backgroundColor: '#fffdfd',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  idText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  orgName: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  inspectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 8,
    borderRadius: RADIUS.sm,
    marginTop: 10,
  },
  avatarIcon: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  inspectorInfo: {
    flex: 1,
  },
  inspectorName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inspectorRole: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
  },
  viewBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
