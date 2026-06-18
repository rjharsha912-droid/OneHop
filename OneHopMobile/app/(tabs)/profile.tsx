import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import api from '../../constants/api';

export default function ProfileScreen() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));

      const res = await api.get('/profile/stats');
      setStats(res.data);
    } catch (err) {
      console.log('Failed to load profile stats', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  const menuItems = [
    { label: 'My Bookings', icon: 'briefcase-outline' },
    { label: 'Saved Places', icon: 'heart-outline' },
    { label: 'Payment Methods', icon: 'card-outline' },
    { label: 'Settings', icon: 'settings-outline' },
    { label: 'Help & Support', icon: 'help-circle-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name[0].toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#0077b6" style={{ marginVertical: 12 }} />
      ) : (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.total_trips ?? 0}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.travel_points ?? 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.total_chats ?? 0}</Text>
            <Text style={styles.statLabel}>Chats</Text>
          </View>
        </View>
      )}

      {menuItems.map((item) => (
        <TouchableOpacity key={item.label} style={styles.menuItem}>
          <Ionicons name={item.icon as any} size={20} color="#333" />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color="#aaa" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerCard: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#0077b6',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 13, color: '#666', marginTop: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#0077b6' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  menuLabel: { marginLeft: 14, fontSize: 15 },
  logoutButton: {
    backgroundColor: '#e63946', borderRadius: 14, padding: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
});