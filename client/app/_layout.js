import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LiquidGlassNav from '../components/LiquidGlassNav';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Stack screenOptions={{ animation: 'fade', animationDuration: 200 }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="map" options={{ title: 'Map', headerShown: false }} />
          <Stack.Screen name="nearby" options={{ title: 'Nearby', headerShown: false }} />
          <Stack.Screen name="saved" options={{ title: 'Saved', headerShown: false }} />
          <Stack.Screen name="spot/[id]" options={{ title: 'Spot Details' }} />
          <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'Register', headerShown: false }} />
        </Stack>
        <LiquidGlassNav />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
