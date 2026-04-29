import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

export default function LiquidGlassSearch({ placeholder, value, onChangeText, style }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={focused ? 85 : 75}
        tint="light"
        style={styles.blurContainer}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder || 'Search...'}
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
});
