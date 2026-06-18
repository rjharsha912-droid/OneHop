import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import api from '../constants/api';

const CITIES = ['Goa', 'Ooty', 'Mumbai', 'Delhi', 'Jaipur'];

export default function HotelsScreen() {
  const [city, setCity] = useState('');
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchHotels = async (selectedCity: string) => {
    setCity(selectedCity);
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/hotels/search', { params: { city: selectedCity } });
      setHotels(res.data.hotels);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to load hotels.');
      setHotels([]);
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
        <Text style={styles.header}>Find Hotels</Text>
      </View>

      <View style={styles.cityRow}>
        {CITIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.cityChip, city === c && styles.cityChipActive]}
            onPress={() => searchHotels(c)}
          >
            <Text style={[styles.cityChipText, city === c && styles.cityChipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator size="large" color="#0077b6" style={{ marginTop: 30 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={hotels}
        keyExtractor={(item, idx) => item.name + idx}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.hotelCard}>
            <View style={styles.hotelHeaderRow}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.hotelRating}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.hotelLocation}>{item.location} · {item.type}</Text>
            <Text style={styles.hotelAmenities}>{item.amenities.join(' · ')}</Text>
            <Text style={styles.hotelPrice}>₹{item.price_per_night} / night</Text>
          </View>
        )}
        ListEmptyComponent={
          !loading && city ? <Text style={styles.emptyText}>No hotels found.</Text> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  header: { fontSize: 20, fontWeight: 'bold' },
  cityRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  cityChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#f1f1f1', marginBottom: 8,
  },
  cityChipActive: { backgroundColor: '#0077b6' },
  cityChipText: { color: '#333', fontSize: 13 },
  cityChipTextActive: { color: '#fff', fontWeight: '600' },
  errorText: { color: '#e63946', textAlign: 'center', marginTop: 20 },
  hotelCard: {
    backgroundColor: '#f8f9fa', borderRadius: 14, padding: 14, marginBottom: 12,
  },
  hotelHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  hotelName: { fontSize: 15, fontWeight: 'bold', flex: 1 },
  hotelRating: { fontSize: 13, color: '#444' },
  hotelLocation: { fontSize: 12, color: '#666', marginTop: 4 },
  hotelAmenities: { fontSize: 12, color: '#888', marginTop: 4 },
  hotelPrice: { fontSize: 14, fontWeight: 'bold', color: '#0077b6', marginTop: 8 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 30 },
});