import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { IllustratedAvatar } from '../../components/onboarding/IllustratedAvatar';
import { getAvatarById } from '../../constants/avatars';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { MainStackParamList } from '../../types';
import { spacing, radius, shadows } from '../../theme';

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
};

export function ProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { palette } = useTheme();
  const { user, logout, refreshUser } = useAuth();
  const avatar = getAvatarById(user?.avatarId);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.getParent()?.goBack();
        },
      },
    ]);
  };

  const menu: MenuItem[] = [
    {
      icon: 'person-outline',
      label: 'Profile Information',
      subtitle: user?.name ?? 'Your account details',
    },
    {
      icon: 'cafe-outline',
      label: 'My Meetups',
      subtitle: 'Meetups you created',
      onPress: () => navigation.navigate('MyMeetups'),
    },
    {
      icon: 'heart-outline',
      label: 'Loved Cafes',
      subtitle: 'Your saved cafés',
      onPress: () => navigation.navigate('Tabs', { screen: 'Loved' }),
    },
    {
      icon: 'calendar-outline',
      label: 'Meetup History',
      subtitle: 'Past and active meetups',
      onPress: () => navigation.navigate('MyMeetups'),
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'briefcase-outline',
      label: user?.role === 'cafe_owner' ? 'Switch to User View' : 'Switch to Cafe Owner View',
      subtitle: 'Developer Testing Toggle',
      onPress: async () => {
        if (user) {
          const newRole = user.role === 'cafe_owner' ? 'user' : 'cafe_owner';
          await refreshUser({ ...user, role: newRole });
        }
      },
    },
    {
      icon: 'log-out-outline',
      label: 'Logout',
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.cream, paddingTop: insets.top }]}
      contentContainerStyle={styles.scroll}
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={palette.espresso} />
      </Pressable>

      <LinearGradient colors={[palette.coffeeBrown, palette.darkCoffee]} style={styles.header}>
        <View style={styles.avatarWrap}>
          <IllustratedAvatar avatar={avatar} size={88} />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        {user?.mobileNumber ? (
          <Text style={styles.phone}>+{user.mobileNumber}</Text>
        ) : null}
        {user?.city ? <Text style={styles.city}>{user.city}</Text> : null}
      </LinearGradient>

      <View style={[styles.infoCard, shadows.soft, { backgroundColor: palette.white }]}>
        <Text style={[styles.infoTitle, { color: palette.espresso }]}>👤 Profile Information</Text>
        <Text style={[styles.infoLine, { color: palette.textSecondary }]}>Name: {user?.name ?? '—'}</Text>
        <Text style={[styles.infoLine, { color: palette.textSecondary }]}>
          Phone: {user?.mobileNumber ? `+${user.mobileNumber}` : '—'}
        </Text>
        {user?.email ? (
          <Text style={[styles.infoLine, { color: palette.textSecondary }]}>Email: {user.email}</Text>
        ) : null}
      </View>

      {menu.slice(1).map((item) => (
        <Pressable
          key={item.label}
          onPress={item.onPress}
          disabled={!item.onPress}
          style={({ pressed }) => [
            styles.menuRow,
            shadows.soft,
            {
              backgroundColor: palette.white,
              opacity: pressed && item.onPress ? 0.92 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: item.danger ? 'rgba(198,40,40,0.1)' : palette.cream },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={item.danger ? palette.error : palette.coffeeBrown}
            />
          </View>
          <View style={styles.menuText}>
            <Text
              style={[
                styles.menuLabel,
                { color: item.danger ? palette.error : palette.espresso },
              ]}
            >
              {item.label === 'My Meetups' && '☕ '}
              {item.label === 'Loved Cafes' && '❤️ '}
              {item.label === 'Meetup History' && '📅 '}
              {item.label === 'Settings' && '⚙️ '}
              {item.label === 'Logout' && '🚪 '}
              {item.label}
            </Text>
            {item.subtitle ? (
              <Text style={[styles.menuSub, { color: palette.textMuted }]}>{item.subtitle}</Text>
            ) : null}
          </View>
          {item.onPress ? (
            <Ionicons name="chevron-forward" size={20} color={palette.textMuted} />
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: spacing.xxl },
  backBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    marginBottom: spacing.md,
  },
  avatarWrap: { marginBottom: spacing.sm },
  name: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: spacing.sm },
  phone: { color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  city: { color: 'rgba(255,255,255,0.7)', marginTop: 2, fontSize: 13 },
  infoCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  infoTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  infoLine: { fontSize: 14, marginTop: 4 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: '700' },
  menuSub: { fontSize: 12, marginTop: 2 },
});
