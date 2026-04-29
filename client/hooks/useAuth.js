import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useCallback } from 'react';

const TOKEN_KEY = 'manabisai_token';

export function useAuth() {
  const [token, setTokenState] = useState(null);

  const setToken = useCallback(async (newToken) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const getToken = useCallback(async () => {
    if (token) return token;
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    setTokenState(stored);
    return stored;
  }, [token]);

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  return { token, setToken, getToken, logout, isLoggedIn: !!token };
}
