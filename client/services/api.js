import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const TOKEN_KEY = 'manabisai_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public endpoints
export const fetchSpots = async () => {
  const { data } = await api.get('/spots');
  return data.data;
};

export const fetchSpotById = async (id) => {
  const { data } = await api.get(`/spots/${id}`);
  return data.data;
};

export const fetchNearby = async (lat, lng, radius = 5) => {
  const { data } = await api.get('/spots/nearby', {
    params: { lat, lng, radius },
  });
  return data.data;
};

export const fetchReviews = async (spotId) => {
  const { data } = await api.get(`/spots/${spotId}/reviews`);
  return data.data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data;
};

// Auth endpoints
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data;
};

export const register = async (name, email, password) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data.data;
};

export const logout = async (refreshToken) => {
  await api.post('/auth/logout', { refreshToken });
};

export const refreshTokens = async (refreshToken) => {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data.data;
};

export default api;
