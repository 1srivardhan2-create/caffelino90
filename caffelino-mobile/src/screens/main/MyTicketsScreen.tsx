import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { useTheme } from '../../context/ThemeContext';
import { radius, shadows, spacing, typography } from '../../theme';
import { API_BASE_URL } from '../../config/env';
import { useAuth } from '../../context/AuthContext';
import { EventRegistration } from '../../types';

export function MyTicketsScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [tickets, setTickets] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events/my-tickets/${user.id}`);
      if (res.data.success) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [user?.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const renderTicket = ({ item }: { item: any }) => {
    const event = item.eventId; // Populated from backend
    if (!event) return null;

    return (
      <View style={[styles.ticketCard, shadows.card, { backgroundColor: '#FFF' }]}>
        {/* Ticket Header Image */}
        <Image source={{ uri: event.bannerUrl }} style={styles.banner} />
        
        {/* Ticket Info */}
        <View style={styles.ticketInfo}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
          
          <Text style={[styles.eventName, { color: palette.espresso }]}>{event.eventName}</Text>
          
          <View style={styles.detailsRow}>
            <Ionicons name="calendar-outline" size={16} color={palette.textSecondary} />
            <Text style={[styles.detailText, { color: palette.textSecondary }]}>
              {event.date} • {event.startTime}
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <Ionicons name="location-outline" size={16} color={palette.textSecondary} />
            <Text style={[styles.detailText, { color: palette.textSecondary }]} numberOfLines={1}>
              {event.venueName}, {event.city}
            </Text>
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.notchLeft} />
          <View style={[styles.dashLine, { borderColor: palette.border }]} />
          <View style={styles.notchRight} />
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={[styles.ticketNumber, { color: palette.espresso }]}>{item.ticketNumber}</Text>
          <Text style={{ color: palette.textSecondary, fontSize: 12, marginBottom: spacing.sm }}>
            Scan at entry
          </Text>
          {item.qrCodeUrl ? (
            <Image source={{ uri: item.qrCodeUrl }} style={styles.qrCode} />
          ) : (
            <View style={styles.qrFallback}>
              <Text>No QR Available</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: palette.cream }]}>
        <ActivityIndicator size="large" color={palette.coffeeBrown} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.cream, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={palette.espresso} />
        </Pressable>
        <Text style={[styles.title, { color: palette.espresso }]}>My Tickets</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item._id}
        renderItem={renderTicket}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.coffeeBrown} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={64} color={palette.border} />
            <Text style={[styles.emptyTitle, { color: palette.espresso }]}>No Tickets Yet</Text>
            <Text style={[styles.emptySubtitle, { color: palette.textSecondary }]}>
              Register for an event to see your tickets here.
            </Text>
            <Pressable
              style={[styles.exploreBtn, { backgroundColor: palette.coffeeBrown }]}
              onPress={() => navigation.navigate('Tabs', { screen: 'Events' })}
            >
              <Text style={styles.exploreBtnText}>Explore Events</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { ...typography.h2 },
  listContent: { padding: spacing.lg, paddingBottom: 100 },
  ticketCard: {
    borderRadius: radius.xl, overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  banner: { width: '100%', height: 120, resizeMode: 'cover' },
  ticketInfo: { padding: spacing.lg, position: 'relative' },
  statusBadge: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4,
  },
  statusText: { color: '#2E7D32', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  eventName: { ...typography.h2, marginBottom: spacing.md, paddingRight: 60 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 6 },
  detailText: { fontSize: 14, flex: 1 },
  divider: { height: 20, flexDirection: 'row', alignItems: 'center', position: 'relative' },
  notchLeft: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#FAF9F6', // Must match container bg
    position: 'absolute', left: -10, zIndex: 1,
  },
  dashLine: {
    flex: 1, borderWidth: 1, borderStyle: 'dashed', marginHorizontal: 15,
  },
  notchRight: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#FAF9F6',
    position: 'absolute', right: -10, zIndex: 1,
  },
  qrSection: { padding: spacing.lg, alignItems: 'center' },
  ticketNumber: { fontSize: 16, fontWeight: '700', letterSpacing: 2, marginBottom: 4 },
  qrCode: { width: 150, height: 150 },
  qrFallback: { width: 150, height: 150, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { ...typography.h2, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, marginTop: spacing.xs, marginBottom: spacing.xl },
  exploreBtn: { paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: radius.full },
  exploreBtnText: { color: '#FFF', fontWeight: '600' },
});
