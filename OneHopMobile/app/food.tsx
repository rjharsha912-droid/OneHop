import { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import api from '../constants/api';

const CITIES = ['Goa', 'Ooty', 'Mumbai', 'Delhi', 'Jaipur'];

export default function FoodScreen() {
  const [city, setCity] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchFood = async (selectedCity: string) => {
    setCity(selectedCity);
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/food/search', { params: { city: selectedCity } });
      setRestaurants(res.data.restaurants);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to load restaurants.');
      setRestaurants([]);
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
        <Text style={styles.header}>Find Food</Text>
      </View>

      <View style={styles.cityRow}>
        {CITIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.cityChip, city === c && styles.cityChipActive]}
            onPress={() => searchFood(c)}
          >
            <Text style={[styles.cityChipText, city === c && styles.cityChipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator size="large" color="#0077b6" style={{ marginTop: 30 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={restaurants}
        keyExtractor={(item, idx) => item.name + idx}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.foodCard}>
            <View style={styles.foodHeaderRow}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodRating}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.foodLocation}>{item.cuisine} · {item.location}</Text>
            <Text style={styles.foodSpecialty}>🍽 {item.specialty}</Text>
            <View style={styles.foodFooterRow}>
              <Text style={styles.foodPrice}>₹{item.avg_cost_per_person} per person</Text>
              <Text style={styles.foodType}>{item.type}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading && city ? <Text style={styles.emptyText}>No restaurants found.</Text> : null
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
  foodCard: {
    backgroundColor: '#f8f9fa', borderRadius: 14, padding: 14, marginBottom: 12,
  },
  foodHeaderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  foodName: { fontSize: 15, fontWeight: 'bold', flex: 1 },
  foodRating: { fontSize: 13, color: '#444' },
  foodLocation: { fontSize: 12, color: '#666', marginTop: 4 },
  foodSpecialty: { fontSize: 12, color: '#888', marginTop: 4 },
  foodFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  foodPrice: { fontSize: 14, fontWeight: 'bold', color: '#0077b6' },
  foodType: {
    fontSize: 11, fontWeight: '600', backgroundColor: '#e7f8ef',
    color: '#1aa15e', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
  },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 30 },
});