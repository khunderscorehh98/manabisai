import Vue from 'vue';
import Vuex from 'vuex';
import api from '../services/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('admin_token') || null,
    user: null,
    spots: [],
    categories: [],
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    token: (state) => state.token,
    spots: (state) => state.spots,
    categories: (state) => state.categories,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('admin_token', token);
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      localStorage.removeItem('admin_token');
    },
    SET_SPOTS(state, spots) {
      state.spots = spots;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      const adminEmail = process.env.VUE_APP_ADMIN_EMAIL;
      const adminPassword = process.env.VUE_APP_ADMIN_PASSWORD;

      if (adminEmail && adminPassword) {
        if (email === adminEmail && password === adminPassword) {
          const mockToken = btoa(`${adminEmail}:${Date.now()}`);
          commit('SET_TOKEN', mockToken);
          return;
        }
        throw new Error('Invalid credentials');
      }

      const { data } = await api.post('/auth/login', { email, password });
      commit('SET_TOKEN', data.data.accessToken);
    },
    logout({ commit }) {
      commit('CLEAR_TOKEN');
    },
    async fetchSpots({ commit, getters }) {
      if (!getters.isLoggedIn) return;
      const { data } = await api.get('/spots');
      commit('SET_SPOTS', data.data);
    },
    async fetchCategories({ commit, getters }) {
      if (!getters.isLoggedIn) return;
      const { data } = await api.get('/categories');
      commit('SET_CATEGORIES', data.data);
    },
    async createSpot({ dispatch }, spotData) {
      await api.post('/spots', spotData);
      dispatch('fetchSpots');
    },
    async updateSpot({ dispatch }, { id, ...spotData }) {
      await api.put(`/spots/${id}`, spotData);
      dispatch('fetchSpots');
    },
    async deleteSpot({ dispatch }, id) {
      await api.delete(`/spots/${id}`);
      dispatch('fetchSpots');
    },
  },
});
