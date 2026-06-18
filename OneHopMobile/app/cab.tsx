import { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import api from '../constants/api';

const CITIES = ['Ooty', 'Coimbatore', 'Bangalore', 'Chennai', 'Goa', 'Mumbai', 'Delhi', 'Jaipur', 'Mysore', 'Pune'];

export default function CabScreen() {
  const [fromCity, setFromCity] = useState('Ooty');
  const [toCity, setToCity] = useState('Coimbatore');
  const [pickingFrom, setPickingFrom] = useState(true);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getEstimate = async () => {
    if (fromCity === toCity) {
      setError('From and To cities cannot be the same.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/cab/estimate', {
        params: { from_city: fromCity, to_city: toCity },
      });
      setEstimates(res.data.estimates);
      setDistance(res.data.distance_km);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Could not fetch cab prices.');
      setEstimates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Compare Cab Prices</Text>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, pickingFrom && styles.toggleBtnActive]}
          onPress={() => setPickingFrom(true)}
        >
          <Text style={styles.toggleLabel}>From</Text>
          <Text style={styles.toggleValue}>{fromCity}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, !pickingFrom && styles.toggleBtnActive]}
          onPress={() => setPickingFrom(false)}
        >
          <Text style={styles.toggleLabel}>To</Text>
          <Text style={styles.toggleValue}>{toCity}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cityRow}>
        {CITIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.cityChip,
              (pickingFrom ? fromCity : toCity) === c && styles.cityChipActive,
            ]}
            onPress={() => (pickingFrom ? setFromCity(c) : setToCity(c))}
          >
            <Text
              style={[
                styles.cityChipText,
                (pickingFrom ? fromCity : toCity) === c && styles.cityChipTextActive,
              ]}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={getEstimate}>
        <Text style={styles.searchButtonText}>
          {loading ? 'Checking...' : 'Get Cab Prices'}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading && <ActivityIndicator size="large" color="#0077b6" style={{ marginTop: 20 }} />}

      {distance !== null && !loading && (
        <Text style={styles.distanceText}>
          {fromCity} → {toCity} · {distance} km
        </Text>
      )}

      <FlatList
        data={estimates}
        keyExtractor={(item) => item.cab_type}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.cabCard}>
            <Text style={styles.cabEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cabType}>{item.cab_type}</Text>
              <Text style={styles.cabMeta}>{item.duration_hrs} hrs · {item.distance_km} km</Text>
            </View>
            <Text style={styles.cabPrice}>₹{item.fare_min} – ₹{item.fare_max}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  header: { fontSize: 20, fontWeight: 'bold' },
  toggleRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  toggleBtn: {
    flex: 1, backgroundColor: '#f1f1f1', borderRadius: 12, padding: 12,
  },
  toggleBtnActive: { backgroundColor: '#e0f0ff', borderWidth: 1.5, borderColor: '#0077b6' },
  toggleLabel: { fontSize: 11, color: '#888' },
  toggleValue: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 2 },
  cityRow: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 12,
  },
  cityChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#f1f1f1', marginBottom: 8,
  },
  cityChipActive: { backgroundColor: '#0077b6' },
  cityChipText: { color: '#333', fontSize: 13 },
  cityChipTextActive: { color: '#fff', fontWeight: '600' },
  searchButton: {
    backgroundColor: '#0077b6', marginHorizontal: 16, borderRadius: 12,
    padding: 14, alignItems: 'center', marginBottom: 8,
  },
  searchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  errorText: { color: '#e63946', textAlign: 'center', marginTop: 12 },
  distanceText: { textAlign: 'center', color: '#666', fontSize: 13, marginTop: 8 },
  cabCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa',
    borderRadius: 14, padding: 14, marginBottom: 12,
  },
  cabEmoji: { fontSize: 28 },
  cabType: { fontSize: 15, fontWeight: 'bold' },
  cabMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  cabPrice: { fontSize: 14, fontWeight: 'bold', color: '#0077b6' },
});
