import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NEON = '#39FF14';
const NAV_HEIGHT = 62;
const PROFILE_SIZE = 52;
const BLUR_INTENSITY = Platform.OS === 'ios' ? 85 : 65;
const GLASS_BORDER = 'rgba(255, 255, 255, 0.09)';
const ANDROID_BG = 'rgba(12, 12, 12, 0.94)';
const GLASS_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.45,
  shadowRadius: 22,
  elevation: 12,
};

const pillItems = [
  { iconOutline: 'map-outline',      iconFilled: 'map',      label: 'Map',    href: '/map' },
  { iconOutline: 'search-outline',   iconFilled: 'search',   label: 'Nearby', href: '/nearby' },
  { iconOutline: 'bookmark-outline', iconFilled: 'bookmark', label: 'Saved',  href: '/saved' },
];

const HIDDEN_ROUTES = ['/login', '/register', '/+not-found'];

// ── Pill nav item ─────────────────────────────────────────────────────────────
function PillItem({ item, isActive, onPress }) {
  const scale      = useRef(new Animated.Value(1)).current;
  const dotOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const dotScale   = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const labelOpac  = useRef(new Animated.Value(isActive ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(dotScale, {
        toValue: isActive ? 1 : 0,
        useNativeDriver: true,
        stiffness: 350,
        damping: 18,
        mass: 0.6,
      }),
      Animated.timing(dotOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(labelOpac, {
        toValue: isActive ? 1 : 0.5,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.82, useNativeDriver: true, stiffness: 500, damping: 18 }).start();

  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, stiffness: 300, damping: 16 }).start();

  return (
    <Pressable
      style={styles.pillItem}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.pillItemInner, { transform: [{ scale }] }]}>
        <Ionicons
          name={isActive ? item.iconFilled : item.iconOutline}
          size={22}
          color={isActive ? NEON : '#606060'}
        />
        <Animated.Text
          style={[styles.label, isActive && styles.labelActive, { opacity: labelOpac }]}
        >
          {item.label}
        </Animated.Text>
        <Animated.View
          style={[styles.dot, { opacity: dotOpacity, transform: [{ scale: dotScale }] }]}
        />
      </Animated.View>
    </Pressable>
  );
}

// ── Profile circle button ─────────────────────────────────────────────────────
function ProfileButton({ isActive, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(ringOpacity, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, stiffness: 500, damping: 18 }).start();

  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, stiffness: 300, damping: 16 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {/* Neon ring — only visible when active */}
        <Animated.View style={[styles.profileRing, { opacity: ringOpacity }]} />

        <View style={[styles.profileCircle, GLASS_SHADOW]}>
          <BlurView intensity={BLUR_INTENSITY} tint="dark" style={styles.profileBlur}>
            <Ionicons
              name={isActive ? 'person' : 'person-outline'}
              size={22}
              color={isActive ? NEON : '#606060'}
            />
          </BlurView>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── Root nav ──────────────────────────────────────────────────────────────────
export default function LiquidGlassNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const insets   = useSafeAreaInsets();

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  const bottomOffset = Math.max(insets.bottom, 8) + 6;

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      {/* 3-item pill */}
      <View style={[styles.pill, GLASS_SHADOW]}>
        <BlurView intensity={BLUR_INTENSITY} tint="dark" style={styles.pillBlur}>
          {pillItems.map((item) => (
            <PillItem
              key={item.href}
              item={item}
              isActive={item.href === pathname}
              onPress={() => router.navigate(item.href)}
            />
          ))}
        </BlurView>
      </View>

      {/* Profile circle */}
      <ProfileButton
        isActive={pathname === '/login'}
        onPress={() => router.navigate('/login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },

  // ── Pill ────────────────────────────────────────────────────────
  pill: {
    height: NAV_HEIGHT,
    flex: 1,
    marginRight: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    overflow: 'hidden',
  },
  pillBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'android' ? ANDROID_BG : undefined,
  },
  pillItem: {
    flex: 1,
    height: NAV_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillItemInner: {
    alignItems: 'center',
    rowGap: 3,
  },
  label: {
    fontSize: 10,
    color: '#606060',
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 3,
  },
  labelActive: {
    color: NEON,
    fontWeight: '700',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: NEON,
    marginTop: 3,
    shadowColor: NEON,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },

  // ── Profile circle ───────────────────────────────────────────────
  profileCircle: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    overflow: 'hidden',
  },
  profileBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'android' ? ANDROID_BG : undefined,
  },
  profileRing: {
    position: 'absolute',
    // slightly larger than the circle to form an outer ring
    width: PROFILE_SIZE + 6,
    height: PROFILE_SIZE + 6,
    borderRadius: (PROFILE_SIZE + 6) / 2,
    borderWidth: 1.5,
    borderColor: NEON,
    top: -3,
    left: -3,
    shadowColor: NEON,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
