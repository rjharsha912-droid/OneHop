import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  const categories = [
    { label: 'Commute', icon: 'car-outline', color: '#fde8d8', route: '/cab' },
    { label: 'Flights', icon: 'airplane-outline', color: '#dbeafe', route: null },
    { label: 'Hotels', icon: 'business-outline', color: '#dcfce7', route: '/hotels' },
    { label: 'Food', icon: 'restaurant-outline', color: '#fde0e0', route: '/food' },
    { label: 'Explore', icon: 'compass-outline', color: '#ede9fe', route: '/(tabs)/chat' },
    { label: 'Bus', icon: 'bus-outline', color: '#fef3c7', route: null },
  ];

  const deals = [
    { title: 'FLAT ₹500 OFF', sub: 'On first hotel booking', code: 'HOTEL500', color: '#f97316' },
    { title: '25% OFF CABS', sub: 'Use code at checkout', code: 'CAB25', color: '#a855f7' },
    { title: 'FREE BREAKFAST', sub: 'Select Ooty hotels', code: 'OOTYBRK', color: '#22c55e' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Where do you want to go?"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="mic-outline" size={20} color="#0077b6" />
        </View>

        {/* AI banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerTag}>● AI TRAVEL ASSISTANT</Text>
          <Text style={styles.bannerTitle}>Plan Your{'\n'}Perfect Trip</Text>
          <Text style={styles.bannerSub}>Hotels · Cabs · Food · Itinerary — one chat away</Text>
          <TouchableOpacity style={styles.bannerButton} onPress={() => router.push('/(tabs)/chat')}>
            <Text style={styles.bannerButtonText}>Start Planning →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>What are you looking for?</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={styles.categoryItem}
              onPress={() => cat.route && router.push(cat.route as any)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon as any} size={22} color="#333" />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hot deals */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🔥 Hot Deals</Text>
          <Text style={styles.allLink}>All ›</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {deals.map((deal) => (
            <View key={deal.title} style={[styles.dealCard, { backgroundColor: deal.color }]}>
              <Text style={styles.dealTitle}>{deal.title}</Text>
              <Text style={styles.dealSub}>{deal.sub}</Text>
              <View style={styles.dealCodeRow}>
                <Text style={styles.dealCode}>{deal.code}</Text>
                <Text style={styles.dealCopy}>Copy →</Text>
              </View>
            </View>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  banner: {
    backgroundColor: '#0a1f6b', borderRadius: 18, padding: 20, marginBottom: 24,
  },
  bannerTag: { color: '#7dd3fc', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  bannerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  bannerSub: { color: '#cbd5e1', fontSize: 13, marginBottom: 16 },
  bannerButton: {
    backgroundColor: '#fff', borderRadius: 10, paddingVertical: 10,
    paddingHorizontal: 16, alignSelf: 'flex-start',
  },
  bannerButtonText: { color: '#0a1f6b', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  allLink: { color: '#0077b6', fontSize: 13 },
  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24,
  },
  categoryItem: { width: '30%', alignItems: 'center', marginBottom: 16 },
  categoryIcon: {
    width: 52, height: 52, borderRadius: 14, justifyContent: 'center',
    alignItems: 'center', marginBottom: 6,
  },
  categoryLabel: { fontSize: 12, color: '#333' },
  dealCard: { width: 220, borderRadius: 16, padding: 16, marginRight: 12 },
  dealTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  dealSub: { color: '#fff', fontSize: 12, marginBottom: 16, opacity: 0.9 },
  dealCodeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dealCode: {
    backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: 12,
    fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  dealCopy: { color: '#fff', fontSize: 12, fontWeight: '600' },
});