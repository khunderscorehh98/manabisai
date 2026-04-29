import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpotCard from '../components/SpotCard';
import { useRouter } from 'expo-router';
import AnimatedScreen from '../components/AnimatedScreen';

const SAVED_KEY = 'manabisai_saved_spots';
const NEON = '#39FF14';

export default function SavedScreen() {
  const [savedSpots, setSavedSpots] = useState([]);
  const router = useRouter();

  const loadSaved = async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_KEY);
      const ids = stored ? JSON.parse(stored) : [];
      setSavedSpots(ids);
    } catch {
      setSavedSpots([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [])
  );

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{savedSpots.length}</Text>
          </View>
        </View>

        <FlatList
          data={savedSpots}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <SpotCard
              spot={item}
              onPress={() => router.push(`/spot/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🗂️</Text>
              <Text style={styles.empty}>No saved spots yet</Text>
              <Text style={styles.emptySub}>Tap the heart on any spot to save it</Text>
            </View>
          }
        />
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  countBadge: {
    backgroundColor: 'rgba(57,255,20,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: { fontSize: 13, fontWeight: '700', color: NEON },
  list: { padding: 12, paddingBottom: 120 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  empty: { fontSize: 17, color: '#888', fontWeight: '600' },
  emptySub: { fontSize: 13, color: '#666', marginTop: 8 },
});
