import { View, Text, TextInput, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Platform, Keyboard, Animated } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import { fetchNearby, fetchSpots } from '../services/api';
import SpotCard from '../components/SpotCard';
import { useRouter } from 'expo-router';
import AnimatedScreen from '../components/AnimatedScreen';

const NEON = '#39FF14';
// NAV_HEIGHT (62) + bottomOffset (~40 on modern iPhone) + gap
const TAB_BAR_HEIGHT = 110;

export default function NearbyScreen() {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const router = useRouter();
  const searchBottom = useRef(new Animated.Value(TAB_BAR_HEIGHT)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(searchBottom, {
        toValue: e.endCoordinates.height + 8,
        duration: Platform.OS === 'ios' ? e.duration : 150,
        useNativeDriver: false,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(searchBottom, {
        toValue: TAB_BAR_HEIGHT,
        duration: Platform.OS === 'ios' ? e.duration : 150,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const loadNearby = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== 'granted') {
          setLocationEnabled(false);
          setLoading(false);
          return;
        }
      }

      const loc = await Location.getCurrentPositionAsync({});
      const data = await fetchNearby(loc.coords.latitude, loc.coords.longitude, 10);
      setSpots(data);
      setFilteredSpots(data);
      setLocationEnabled(true);
    } catch {
      try {
        const all = await fetchSpots();
        setSpots(all.slice(0, 10));
        setFilteredSpots(all.slice(0, 10));
      } catch {
        setSpots([]);
        setFilteredSpots([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNearby();
    }, [])
  );

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredSpots(spots);
    } else {
      const filtered = spots.filter(
        (spot) =>
          spot.name?.toLowerCase().includes(text.toLowerCase()) ||
          spot.category?.toLowerCase().includes(text.toLowerCase()) ||
          spot.description?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSpots(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNearby();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={NEON} />
        <Text style={styles.loadingText}>Finding spots near you...</Text>
      </View>
    );
  }

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nearby</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: locationEnabled ? NEON : '#444' }]} />
            <Text style={styles.subtitle}>
              {locationEnabled ? 'Within 10km radius' : 'Location unavailable'}
            </Text>
          </View>
        </View>

        <FlatList
          data={filteredSpots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SpotCard
              spot={item}
              onPress={() => router.push(`/spot/${item.id}`)}
              showDistance
            />
          )}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={NEON}
              colors={[NEON]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={styles.empty}>
                {search ? 'No results found' : 'No nearby spots found'}
              </Text>
            </View>
          }
        />

        <Animated.View style={[styles.searchWrapper, { bottom: searchBottom }]}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search spots, categories..."
              placeholderTextColor="#555"
              value={search}
              onChangeText={handleSearch}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>
        </Animated.View>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#888' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  title: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  subtitle: { fontSize: 13, color: '#888' },
  searchWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#141414',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchIcon: { fontSize: 14, opacity: 0.5 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#fff',
  },
  list: { padding: 12, paddingTop: 8, paddingBottom: 180 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  empty: { fontSize: 15, color: '#777', textAlign: 'center' },
});
