import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import api from '../../constants/api';

export default function TripsScreen() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrips = async () => {
    try {
      const res = await api.get('/chat/history');
      setTrips(res.data);
    } catch (err) {
      console.log('Failed to load trips', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.header}>My Trips</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0077b6" style={{ marginTop: 40 }} />
        ) : trips.length === 0 ? (
          <Text style={styles.emptyText}>No trips yet. Start planning one in OneHop AI!</Text>
        ) : (
          trips.map((trip) => {
            const isComplete = trip.is_complete;
            const itinerary = trip.trip_data || {};
            const city = itinerary.city ?? 'Trip in progress';

            return (
              <View
                key={trip._id}
                style={[styles.card, { backgroundColor: isComplete ? '#dcfce7' : '#fef3c7' }]}
              >
                <Ionicons name="map-outline" size={24} color="#333" style={{ marginBottom: 8 }} />
                <Text style={styles.tripName}>{city}</Text>
                <Text style={styles.tripDate}>
                  {new Date(trip.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.tripStatus}>
                  {isComplete ? 'Completed' : 'In Progress'}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 14 },
  card: { borderRadius: 16, padding: 16, marginBottom: 14 },
  tripName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  tripDate: { fontSize: 13, color: '#444', marginBottom: 6 },
  tripStatus: { fontSize: 12, fontWeight: '600', color: '#0077b6' },
});