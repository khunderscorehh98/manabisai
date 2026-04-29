import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState, useEffect, useRef } from 'react';
import { fetchSpots, fetchNearby } from '../services/api';
import AnimatedScreen from '../components/AnimatedScreen';
import LiquidGlassSearch from '../components/LiquidGlassSearch';

const NEON = '#39FF14';
// NAV_HEIGHT (62) + bottomOffset (~40 on modern iPhone) + gap
const TAB_BAR_HEIGHT = 110;
const BLUR_INTENSITY = Platform.OS === 'ios' ? 85 : 65;
const ANDROID_BG = 'rgba(12, 12, 12, 0.94)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.09)';
const GLASS_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.45,
  shadowRadius: 22,
  elevation: 12,
};

export default function MapScreen() {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);
  const hudBottom = useRef(new Animated.Value(TAB_BAR_HEIGHT)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(hudBottom, {
        toValue: e.endCoordinates.height + 8,
        duration: Platform.OS === 'ios' ? e.duration : 150,
        useNativeDriver: false,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(hudBottom, {
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

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation(loc.coords);
          try {
            const data = await fetchNearby(loc.coords.latitude, loc.coords.longitude, 10);
            setSpots(data);
            setFilteredSpots(data);
          } catch {
            const all = await fetchSpots();
            setSpots(all);
            setFilteredSpots(all);
          }
        }

        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (newLoc) => {
            if (isMounted) {
              setLocation(newLoc.coords);
              if (isFollowingUser && mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: newLoc.coords.latitude,
                  longitude: newLoc.coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }, 500);
              }
            }
          }
        );
      }
      if (isMounted) {
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [isFollowingUser]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredSpots(spots);
    } else {
      const filtered = spots.filter(
        (spot) =>
          spot.name?.toLowerCase().includes(text.toLowerCase()) ||
          spot.category?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSpots(filtered);
    }
  };

  const handleLocate = () => {
    setIsFollowingUser(true);
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 500);
    }
  };

  if (loading) {
    return (
      <AnimatedScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={NEON} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          userInterfaceStyle="dark"
          showsUserLocation={true}
          showsMyLocationButton={false}
          initialRegion={
            location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }
              : {
                  latitude: 4.9031,
                  longitude: 114.9398,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }
          }
        >
          {location && (
            <>
              <Marker
                coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                title="You are here"
                description="Your current location"
              >
                <View style={styles.userMarker}>
                  <View style={styles.userMarkerInner} />
                </View>
              </Marker>
              <Circle
                center={{ latitude: location.latitude, longitude: location.longitude }}
                radius={location.accuracy || 50}
                strokeColor="rgba(57, 255, 20, 0.3)"
                fillColor="rgba(57, 255, 20, 0.1)"
              />
            </>
          )}

          {filteredSpots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
              title={spot.name}
              description={spot.category}
              pinColor={NEON}
            />
          ))}
        </MapView>

        {/* Entire HUD animates as one unit above the keyboard */}
        <Animated.View style={[styles.hud, { bottom: hudBottom }]}>
          {/* Controls row: count pill (left) + locate button (right) */}
          <View style={styles.controlsRow}>
            {/* Spot count pill */}
            <View style={[styles.countPill, GLASS_SHADOW]}>
              <BlurView
                intensity={BLUR_INTENSITY}
                tint="dark"
                style={styles.countBlur}
              >
                <View style={styles.countDot} />
                <Text style={styles.countText}>{filteredSpots.length} spots</Text>
              </BlurView>
            </View>

            {/* Locate me button */}
            {location && (
              <Pressable
                style={[styles.locateButton, GLASS_SHADOW]}
                onPress={handleLocate}
              >
                <BlurView
                  intensity={BLUR_INTENSITY}
                  tint="dark"
                  style={styles.locateBlur}
                >
                  <Ionicons
                    name={isFollowingUser ? 'navigate' : 'navigate-outline'}
                    size={18}
                    color={NEON}
                  />
                </BlurView>
              </Pressable>
            )}
          </View>

          {/* Search bar */}
          <LiquidGlassSearch
            placeholder="Search on map..."
            value={search}
            onChangeText={handleSearch}
            style={styles.searchBar}
          />
        </Animated.View>
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  map: { flex: 1 },

  hud: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 8,
  },

  // ── Controls row ──────────────────────────────────────────────
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  countPill: {
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    overflow: 'hidden',
  },
  countBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    backgroundColor: Platform.OS === 'android' ? ANDROID_BG : undefined,
  },
  countDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NEON,
    shadowColor: NEON,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  countText: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  locateButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    overflow: 'hidden',
  },
  locateBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'android' ? ANDROID_BG : undefined,
  },

  // ── Search bar ────────────────────────────────────────────────
  searchBar: { flex: 1 },

  // ── Misc ──────────────────────────────────────────────────────
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#888' },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(57, 255, 20, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NEON,
    shadowColor: NEON,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    ...Platform.select({
      ios: { shadowColor: NEON },
      android: { elevation: 5 },
    }),
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: NEON,
  },
});
