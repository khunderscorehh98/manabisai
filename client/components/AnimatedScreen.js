import { useRef, useCallback } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';

export default function AnimatedScreen({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
