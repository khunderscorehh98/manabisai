<template>
  <v-app style="background: #0A0A0A;">
    <!-- Top App Bar -->
    <v-app-bar app flat height="64" style="background: #111111; border-bottom: 1px solid rgba(255,255,255,0.06);">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white" />
      <div class="d-flex align-center ml-1">
        <span style="font-size: 22px; margin-right: 8px;">🍜</span>
        <span style="font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.3px;">ManaBisai</span>
        <span style="font-size: 11px; font-weight: 600; color: #39FF14; margin-left: 8px; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.9;">Admin</span>
      </div>
      <v-spacer />
      <template v-if="isLoggedIn">
        <div class="d-flex align-center mr-2" style="gap: 8px;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: #39FF14; box-shadow: 0 0 8px #39FF14;"></div>
          <span style="font-size: 13px; color: #888;">online</span>
        </div>
        <v-btn icon @click="logout" color="white" title="Logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Left Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      width="220"
      style="background: #111111; border-right: 1px solid rgba(255,255,255,0.06);"
    >
      <div style="height: 64px; display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,0.06);">
        <span style="font-size: 12px; font-weight: 600; color: #444; letter-spacing: 1.5px; text-transform: uppercase;">Navigation</span>
      </div>

      <v-list nav dense class="mt-2 px-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          exact
          active-class="nav-item-active"
          class="nav-item mb-1"
          style="border-radius: 10px;"
        >
          <v-list-item-icon style="margin-right: 12px; min-width: 0;">
            <v-icon small>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-size: 14px; font-weight: 500;">{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div style="padding: 16px; border-top: 1px solid rgba(255,255,255,0.06);">
          <v-btn
            v-if="isLoggedIn"
            block
            text
            @click="logout"
            style="border: 1px solid rgba(255,82,82,0.3); border-radius: 10px; color: #FF5252; font-size: 13px;"
          >
            <v-icon left small>mdi-logout</v-icon>
            Sign out
          </v-btn>
          <v-btn
            v-else
            block
            text
            to="/login"
            style="border: 1px solid rgba(57,255,20,0.3); border-radius: 10px; color: #39FF14; font-size: 13px;"
          >
            <v-icon left small>mdi-login</v-icon>
            Sign in
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main style="background: #0A0A0A;">
      <div style="padding: 28px 32px; max-width: 1200px;">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      drawer: true,
      navItems: [
        { to: '/spots', icon: 'mdi-map-marker-multiple', label: 'Food Spots' },
        { to: '/categories', icon: 'mdi-tag-multiple', label: 'Categories' },
      ],
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
  },
};
</script>

<style>
/* Global dark overrides */
.v-application {
  background: #0A0A0A !important;
}

/* Nav item default state */
.nav-item .v-icon,
.nav-item .v-list-item__title {
  color: #666 !important;
  transition: color 0.2s;
}

.nav-item:hover .v-icon,
.nav-item:hover .v-list-item__title {
  color: #bbb !important;
}

.nav-item:hover {
  background: rgba(255,255,255,0.04) !important;
}

/* Active nav item */
.nav-item-active {
  background: rgba(57, 255, 20, 0.08) !important;
}

.nav-item-active .v-icon,
.nav-item-active .v-list-item__title {
  color: #39FF14 !important;
}

/* Vuetify dark table overrides */
.v-data-table {
  background: #141414 !important;
  border-radius: 12px !important;
}

.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  background: #1a1a1a !important;
  color: #666 !important;
  font-size: 11px !important;
  letter-spacing: 1px !important;
  text-transform: uppercase !important;
  font-weight: 600 !important;
  border-bottom: 1px solid rgba(255,255,255,0.06) !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr {
  border-bottom: 1px solid rgba(255,255,255,0.04) !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background: rgba(255,255,255,0.03) !important;
}

/* Input overrides */
.v-text-field--outlined fieldset {
  border-color: rgba(255,255,255,0.1) !important;
}

.v-text-field--outlined:hover fieldset {
  border-color: rgba(255,255,255,0.2) !important;
}

.v-text-field--outlined.v-input--is-focused fieldset {
  border-color: #39FF14 !important;
}

/* Card overrides */
.v-card {
  background: #141414 !important;
  border: 1px solid rgba(255,255,255,0.07) !important;
  border-radius: 14px !important;
}

/* Chip overrides */
.v-chip {
  font-size: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0A0A0A;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
