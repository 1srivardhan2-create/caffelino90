import React from 'react';
import { StyleSheet, Text, View, Switch, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import type { MainStackParamList } from '../../types';
import { spacing, radius, typography } from '../../theme';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { palette, isDark, setMode } = useTheme();
  const { logout } = useAuth();
  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.cream, paddingTop: insets.top }]}>
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={{ color: palette.coffeeBrown, fontWeight: '600' }}>← Back</Text>
      </Pressable>

      <Text style={[styles.title, { color: palette.espresso }]}>Settings</Text>

      <View style={[styles.row, { backgroundColor: palette.white, borderColor: palette.border }]}>
        <Text style={{ color: palette.espresso, flex: 1 }}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>



      <Pressable style={[styles.row, styles.privacy]} onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon.')}>
        <Text style={{ color: palette.espresso }}>Privacy</Text>
      </Pressable>

      <Pressable
        onPress={handleLogout}
        style={[styles.logout, { backgroundColor: palette.error }]}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  back: { marginBottom: spacing.md },
  title: { ...typography.h1, marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  privacy: { justifyContent: 'center' },
  logout: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
